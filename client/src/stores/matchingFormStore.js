import { makeAutoObservable, runInAction } from "mobx";

class MatchingFormStore {
  isLoading = false;
  countdown = 0;

  constructor() {
    makeAutoObservable(this);
  }

  startLoading() {
    this.isLoading = true;
    this.countdown = 60;

    const countdownInterval = setInterval(() => {
      runInAction(() => {
        if (this.countdown > 0) {
          this.countdown -= 1;
        } else {
          this.isLoading = false;
          clearInterval(countdownInterval);
        }
      });
    }, 1000);
  }

  setTest(test) {
    this.test = test;
  }
}

export const matchingFormStore = new MatchingFormStore();
