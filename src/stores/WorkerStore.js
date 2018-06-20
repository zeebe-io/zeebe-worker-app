import BaseStore from 'primitives/BaseStore';
import { runInAction, action, ObservableMap } from 'mobx';
import serialize from 'form-serialize';
import Router from 'next/router';

import io from 'socket.io-client';

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
    const worker = await this.http.post('http://127.0.0.1:4860/json/workers', data);
    runInAction('add worker', () => {
      this.state.workers.push(worker);
      this.closeAddDialog();
    });
  };

  activateWorker = worker => async () => {
    const response = await this.http.post('http://127.0.0.1:4860/json/activate-worker', worker);
    runInAction('activate worker', () => {
      worker.childProcess = response.childProcess;
    });
  };

  deactivateWorker = worker => async () => {
    const response = await this.http.post('http://127.0.0.1:4860/json/deactivate-worker', worker);
    runInAction('deactivate worker', () => {
      worker.childProcess = response.childProcess;
    });
  };

  deleteWorker = async (worker) => {
    await this.http.delete('http://127.0.0.1:4860/json/workers', worker);
  };

  remove = worker => async () => {
    await this.deactivateWorker(worker);
    await this.deleteWorker(worker);
    runInAction('remove worker from list', () => {
      this.state.workers.remove(worker);
    });
  };

  fetchCurrentWorker = async (id) => {
    const worker = await this.http.get(`http://127.0.0.1:4860/json/workers/${id}`);
    runInAction(() => {
      this.state.currentWorker = worker;
    });
  };

  updateCurrentWorker = async () => {
    const { currentWorker } = this.state;
    const id = currentWorker.workerFile;
    await this.http.put(`http://127.0.0.1:4860/json/workers/${id}`, currentWorker);
    Router.back();
  };

  constructor(initialState, options, { http }) {
    super(initialState);
    this.http = http;

    this.fetchWorkers();
    if (process.browser) {
      this.io = io('http://127.0.0.1:4860');
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
    const workers = await this.http.get('http://127.0.0.1:4860/json/workers');
    runInAction('set workers', () => {
      this.state.workers = workers;
    });
  };
}

export default WorkerStore;
