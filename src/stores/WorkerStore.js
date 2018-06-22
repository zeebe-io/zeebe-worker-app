import BaseStore from 'primitives/BaseStore';
import { runInAction, action, ObservableMap } from 'mobx';
import serialize from 'form-serialize';
import Router from 'next/router';
import io from 'socket.io-client';

import env from 'env';

class WorkerStore extends BaseStore {
  static defaultState = {
    workers: [],
    isAddDialogOpen: false,
    currentWorker: null,
    stats: new ObservableMap(),
  };

  @action
  openAddDialog = () => {
    this.state.isAddDialogOpen = true;
  };

  @action
  closeAddDialog = () => {
    this.state.isAddDialogOpen = false;
  };

  handleAddSubmit = async (event) => {
    event.preventDefault();
    const data = serialize(event.currentTarget, { hash: true });
    const worker = await this.http.post(`${env.restUrl}/workers`, data);
    runInAction('add worker', () => {
      this.state.workers.push(worker);
      this.closeAddDialog();
    });
  };

  activateWorker = worker => async () => {
    const response = await this.http.post(`${env.restUrl}/activate-worker`, worker);
    runInAction('activate worker', () => {
      worker.childProcess = response.childProcess;
    });
  };

  deactivateWorker = worker => async () => {
    const response = await this.http.post(`${env.restUrl}/deactivate-worker`, worker);
    runInAction('deactivate worker', () => {
      worker.childProcess = response.childProcess;
    });
  };

  deleteWorker = async (worker) => {
    await this.http.delete(`${env.restUrl}/workers`, worker);
  };

  remove = worker => async () => {
    await this.deactivateWorker(worker);
    await this.deleteWorker(worker);
    runInAction('remove worker from list', () => {
      this.state.workers.remove(worker);
    });
  };

  fetchCurrentWorker = async (id) => {
    const worker = await this.http.get(`${env.restUrl}/workers/${id}`);
    runInAction(() => {
      this.state.currentWorker = worker;
    });
  };

  updateCurrentWorker = async () => {
    const { currentWorker } = this.state;
    const id = currentWorker.workerFile;
    await this.http.put(`${env.restUrl}/workers/${id}`, currentWorker);
    Router.back();
  };

  constructor(initialState, options, { http }) {
    super(initialState);
    this.http = http;

    this.fetchWorkers();
    if (process.browser) {
      this.io = io(`${env.restUrl}`);
      this.io.on('update-stats', (stats) => {
        runInAction('update stats', () => {
          const keys = Object.keys(stats);
          keys.forEach((key) => {
            this.state.stats.set(key, stats[key]);
          });
        });
      });
    }
    // console.log(io);
  }

  fetchWorkers = async () => {
    const workers = await this.http.get(`${env.restUrl}/workers`);
    runInAction('set workers', () => {
      this.state.workers = workers;
    });
  };
}

export default WorkerStore;
