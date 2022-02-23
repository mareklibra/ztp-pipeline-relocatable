---
modified: "2022-02-23T08:51:08.716Z"
---

- [ztp-pipeline-relocatable](#ztp-pipeline-relocatable)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
    - [The Spokes YAMl file](#the-spokes-yaml-file)
  - [Lab testing](#lab-testing)
    - [Hub](#hub)
    - [Spokes](#spokes)
  - [Usage](#usage)
    - [OpenShift Pipelines installation](#openshift-pipelines-installation)
    - [Pipeline execution Hub](#pipeline-execution-hub)
    - [Pipeline execution Spoke](#pipeline-execution-spoke)
    - [Monitoring](#monitoring)

# ztp-pipeline-relocatable

## Introduction

This Repository contains a pipeline using GitHub Actions that can be used to configure a running OpenShift instance (reachable via provided `KUBECONFIG`) to:

- deploy Advanced Cluster Management (ACM) components
- a Registry with mirrored images
- configure spoke clusters into ACM based on the `spokes.yaml` file provided as input
- deploy a mirror in the spoke cluster
- etc

The pipeline has two parts:

- One that deploys the HUB cluster configuration (based on existing requirements, like OCP deployed with ODF and volumes created)
- Another that deploys Spoke clusters based on the configuration

The actual workflow can be checked at the files inside the `.github/workflows/` folder.

## Requirements

- Hub with 3 nodes and all Cluster Operators ready
- PVCs for the Hub
- ## DNS and DHCP configured with the entries for:
- `spokes.yaml` file with the configuration for the spokes

### The Spokes YAMl file

## Lab testing

This section will cover two aspects of the testing, the HUB and the Spokes

### Hub

We internally use the files in the folder `hack/deploy` to virtually setup an environment to test the pipeline.

The first step is the `build-hub.sh` which builds the hab deployment with all the requirements (hub, DNS, PVC's, spokes.yaml, etc.) that will be later used with OpenShift Pipelines to perform all the tests.

### Spokes

## Usage

### OpenShift Pipelines installation

First we need to install OpenShift Pipelines Operator that will be used for running the pipeline, this is achieved by using a bootstrapping script that will install the Operator and the CR to initiate the deployment.

This script will also create the required pipeline definitions and tasks.

### Pipeline execution Hub

```sh
tkn XXXXX
```

### Pipeline execution Spoke

### Monitoring

You can follow the pipeline execution via XXXXX
