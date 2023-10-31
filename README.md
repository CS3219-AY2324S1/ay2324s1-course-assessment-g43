# How to deploy to GCP

## Install Google Cloud SDK

Follow the [official documentation](https://cloud.google.com/sdk/docs/install) for the installation instructions.

Ignore the `gcloud init` instruction.

## Authenticate Google Cloud and select project

Go into the `ay2324s1-course-assessment-g43` folder, our main folder containing all the microservices, and run

```
gcloud init
```

This should open a browser window where you can sign in with your Google account and select the project that you should have already been added into.

## Deploying each microservice to GCP

1. `cd` into each microservice
2. run the `gcloud` command to run the `Dockerfile` and deploy to GCP

```
cd client
gcloud builds submit --tag gcr.io/ay2324s1-cs3219-g43/client:1.0-SNAPSHOT

cd ../src/question-service
gcloud builds submit --tag gcr.io/ay2324s1-cs3219-g43/question-service:1.0-SNAPSHOT

cd ../user-service
gcloud builds submit --tag gcr.io/ay2324s1-cs3219-g43/user-service:1.0-SNAPSHOT

cd ../matching-service
gcloud builds submit --tag gcr.io/ay2324s1-cs3219-g43/matching-service:1.0-SNAPSHOT
```

## Deploy secrets to the cluster

Get the `secrets.yaml` file and put it in the folder that contains the `kubernetes.yaml` file

Make sure you are in the folder that contains the `secrets.yaml` file and run

```
kubectl apply -f secrets.yaml
```

## Deploy containers to the cluster

We are basically applying the kubernetes.yaml onto the cluster. This essentially puts those containers that we created above into our cluster on GKE.

Make sure you are in the folder that contains the `kubernetes.yaml` file and run

```
kubectl apply -f kubernetes.yaml
```
