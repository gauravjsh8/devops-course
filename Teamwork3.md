## What is the main purpose of DevOps?

The main purpose of DevOps is to improve collaboration between development and operation teams by automating and simplifying the process of building, testing, releasing and maintaining applications.

## What are the main stages of a CI/CD pipeline?

The main stages of CI/CD pipeline are code, build, test, release, deploy and monitor the application.

## Which DevOps tools can be used for source control, CI/CD, containerization, infrastructure, configuration management, and monitoring?

For source control-git, for CI/CD – Jenkins, for containerization – Docker, for infrastructure – Terraform, for configuration management – Ansible, for monitoring- Prometheus

## How can Git support effective collaboration in DevOps?

Git allows many developers to work on the same project. Developers can create different branches based on features or fixes, commit their changes and merge into the shared branches. In this way, they can collaborate with DevOps.

## What is Infrastructure as Code (IaC), and what are its benefits?

Infrastructure as code is a method of managing and provisioning infrastructures using code and automation rather than applying manual processes. It helps to avoid physical hardware setup or manual clicking and does automatically.
The main benefits of IaC are: -
- It deploys identical environments for testing and production
- It automates setups that used to take days or weeks of manual work to a few minutes.
- It makes deployment repeatable and consistent

## What is configuration management, and how can Ansible support it?

Configuration management means keeping computers and servers configured correctly and working in the same way. Ansible supports it by automatically configuring servers, installing required software, creating users, deploying applications and applying consistent settings across multiple machines.

## What are containers, and why are they useful in DevOps?

Containers are small packages that contain applications and everything like dependencies, libraries, etc, that it need to run. They are useful in DevOps because they help reduce differences between development, testing and production environments.

## What is container orchestration, and what role does Kubernetes play?

Container orchestration is the automated deployment management, scaling and networking of containers across a cluster of servers. Managing containers manually is difficult at scale. So, Kubernetes manages containerized applications, when many containers need to run across multiple machines. It helps with scheduling containers, scaling applications, restarting failed workloads, service discovery and rolling out new versions.

## What are monitoring and observability, and which tools support them?

Monitoring and observability means showing certain metrics regarding the software that tell about its ‘health’. This could be through dashboards that show its error rate, cpu usage or latency/response time for example. An example of such a tool is Grafana and Prometheus

## What is DevSecOps, and how does it improve software security?

It is an approach that includes security as part of Development and Operations at every stage of software building. It improves software by catching security bugs early (for example through an automated process). This lowers cost and at the same time speeds up security checks.

## Why is automated testing important in DevOps?

It reduces the amount of time spent manually running tests. Automated tests are consistent which makes them reliable. This speeds up the time it takes to go from development to release by catching issues almost immediately after committing (or raising a PR) to a shared repository.

## What is configuration drift, and how can it be reduced?

A configuration drift is when a system gradually changes over time and it no longer matches its original form. This could cause problems when environments change. This can be reduced by using a tool like Terraform that defines Infrastructure as Code and Ansible to automate such configurations.

## Why are small and frequent deployments considered a DevOps best practice?

This makes the changes easier to track and reduces risk because developers will be able to debug relatively quickly and also recover previous version easily.

## What are the main steps for responding to a failed deployment?

It is important to assess the impact first and to communicate with the team. Then we can pinpoint the source of this failure by checking the CI and CD logs. This enables us to isolate the issue. After that we can determine what the mitigation strategy can be. For example going back to a previous version or making a hotfix.

## How can Git, Jenkins, Docker, Kubernetes, Terraform, Ansible, Prometheus, and Grafana work together?

Each has a specific role when they are used in software development.

Git: version control Jenkins: automate build/test/deploy of application Docker: containerizing applications Kubernetes: container orchestration Terraform: defining infrastructure Ansible: configuration automation Prometheus: metrics collection and alerting Grafana: monitoring dashboards
