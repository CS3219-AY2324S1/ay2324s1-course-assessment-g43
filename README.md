# How to start local development using Docker

## Ensure that you have the right env files

Make sure you have the right .env\* files and they are

1. In the right folder
2. Have the correct file name
3. Have the correct content in them

## Run docker compose file

Run the `docker-compose.yml` file from the main folder. This does 2 things.

1. runs an `npm install`
2. runs the app by doing either `npm run dev` (development) or `npm run start` (production)

Kind of like how you would run `npm run install-all` and then `npm run dev-all`

This is the command:

```
PEERPREP_ENV=development docker compose up
```

> [!NOTE]  
> If you want to start a local environment that mimics production, you can either run
> `PEERPREP_ENV=production docker compose up` or just `docker compose up`

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

## Install ingress controller to google cloud using helm

Install ingress controller to google cloud with this command. You might have to install helm to your machine if you don't already have it.

```
helm install my-nginx-controller ingress-nginx/ingress-nginx
```

You might get an error message saying that an ingress controller called `my-nginx-controller` is already installed. If that is the case, you can skip this step.

However, if for whatever reason you feel uncertain, you can run `helm uninstall my-nginx-controller` to uninstall the controller and then run the command above to reinstall it.

## Deploy network policy and ingress resources

Deploy the network policy and ingress resources to google cloud by applying their yaml files.

```
kubectl apply -f my-network-policy.yaml
kubectl apply -f my-ingress.yaml
kubectl apply -f my-client-ingress.yaml
```

## Deploy containers to the cluster

We are basically applying the `kubernetes.yaml` onto the cluster. This essentially puts those containers that we created above into our cluster on GKE.

Make sure you are in the folder that contains the `kubernetes.yaml` file and run

```
kubectl apply -f kubernetes.yaml
```

## Verify that you have gotten everything right

Run `kubectl get pods` and you should see this (the alphanumeric stuff behind might not be the same)

```
NAME                                                            READY   STATUS    RESTARTS   AGE
client-f8c5dd688-lzkmp                                          1/1     Running   0          12s
matching-service-6d5f485dc8-9dncc                               1/1     Running   0          11s
matching-service-6d5f485dc8-b7stq                               1/1     Running   0          11s
my-nginx-controller-ingress-nginx-controller-68c8d6798c-4rfss   1/1     Running   0          20m
question-service-cf5f46679-7jtl9                                1/1     Running   0          11s
question-service-cf5f46679-gj7vq                                1/1     Running   0          11s
user-service-89c7b8b79-j692n                                    1/1     Running   0          11s
user-service-89c7b8b79-vgs5g                                    1/1     Running   0          11s
```

Run `kubectl get svc` and you should see this (the alphanumeric stuff behind might not be the same)

```
NAME                                                     TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
client                                                   ClusterIP      XX.XX.XX.XX     <none>          5173/TCP                     20s
kubernetes                                               ClusterIP      XX.XX.XX.XX      <none>          443/TCP                      4h40m
matching-service                                         ClusterIP      XX.XX.XX.XX   <none>          5001/TCP                     19s
my-nginx-controller-ingress-nginx-controller             LoadBalancer   XX.XX.XX.XX   34.126.73.169   80:31475/TCP,443:31126/TCP   20m
my-nginx-controller-ingress-nginx-controller-admission   ClusterIP      XX.XX.XX.XX   <none>          443/TCP                      20m
question-service                                         ClusterIP      XX.XX.XX.XX    <none>          3000/TCP                     19s
user-service                                             ClusterIP      XX.XX.XX.XX     <none>          8000/TCP                     19s
```
