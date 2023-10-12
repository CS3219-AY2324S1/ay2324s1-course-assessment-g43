import { makeAutoObservable, runInAction } from "mobx";

class MatchingFormStore {
  isLoading = false;
  countdown = 0;

  constructor() {
    makeAutoObservable(this);
  }

  resetState() {
    this.isLoading = false;
    this.countdown = 0;
  }

  startLoading() {
    this.isLoading = true;
    this.countdown = 60;

    return new Promise((resolve, reject) => {
      const countdownInterval = setInterval(() => {
        runInAction(() => {
          if (this.countdown > 0) {
            this.countdown -= 1;
          } else {
            this.isLoading = false;
            reject("Sorry, but we could not find a match. Please try again!");
            clearInterval(countdownInterval);
          }
        });
      }, 1000);
    });
  }
}

export const matchingFormStore = new MatchingFormStore();
