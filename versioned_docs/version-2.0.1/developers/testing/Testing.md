---
id: testing
title: Testing
---

import MerryTitle from "./Title";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Introducing Merry: our in-house tool designed to streamline cross-chain testing. With Merry, you no longer have to wait for blocks to be mined—take full control of your testing timeline.

## <MerryTitle />

This CLI tool leverages Docker to effortlessly set up a multi-chain testing environment in a single command. Merry includes Bitcoin regtest node, Ethereum localnet node, and essential Catalog services(Filler and Orderbook), providing a self-contained space to test your applications independently of external services.

It supports a variety of features, including a faucet, Electrum services and an Orderbook with Filler.

Orderbook is an order matching engine developed by Catalog, use this [section](/docs/developers/api/GardenAPI.md) to learn more about it.

Solver is a bot to fill orders based on strategies set, learn more about it in this [section](/docs/developers/api/GardenAPI.md).

## Installation

:::note
Merry supports arm64 and amd64 architectures. For Windows users, you are required to use Windows Subsystem for Linux (WSL) to run Merry.
:::

### Prerequisites

Before using Merry, ensure you have Docker installed and running on your system. If not, you'll need to download and install Docker from the official [website](https://www.docker.com).

## Install using the script

<Tabs>
<TabItem value="unix" label="Linux & MacOS" default>
Run the following command to install Merry

```bash
curl https://get.merry.dev | bash
```

</TabItem>
<TabItem value="windows" label="Windows">
In a WSL terminal, run `sudo dockerd` and verify if the docker daemon is running, then

```bash
curl https://get.merry.dev | bash
```

</TabItem>
</Tabs>

Merry stores its configuration files and other data in a directory on your system. This directory is typically named `.merry`.

## Commands

Merry provides a variety of commands to manage your testing environment:

### Starting Merry

```bash
merry go
```

Starts all services, including the Bitcoin regtest node, Ethereum localnet node, explorers for the nodes and the catalog services.

- `--bare` flag: Starts only the multi-chain services (Bitcoin and Ethereum nodes with explorers) and excludes catalog services. This option is useful if you don't need the additional functionalities such as Filler and Orderbook by Catalog.

- `--headless` flag: Starts all services except for frontend interfaces. This can be helpful for running Merry in headless environments (e.g., servers) where a graphical user interface is not required.

### Stopping Merry

```bash
merry stop

# reset data
merry stop -d
```

Stops all running services. Use `--delete` or `-d` to remove data.

### Getting logs

```bash
merry logs -s <service>

# getting logs of evm service
merry logs -s evm
```

Replace \<service> with the specific service (e.g., Filler, EVM) to view its logs.

### Replacing a service with a local one

```bash
merry replace <service>
```

This command allows you to replace a service with your local development version. Make sure you're in the directory containing the local service's Dockerfile. Supported services include Filler, Orderbook, and EVM.

### Calling bitcoin rpc methods

```bash
merry rpc <method> <params>

# example: get blockchain info
merry rpc getblockchaininfo
```

Interact with the Bitcoin regtest node directly using RPC methods.

### Updating Docker images

```bash
merry update
```

Keep your testing environment up-to-date by updating all Docker images.

### Fund accounts

```bash
merry faucet --to <address>
```

Fund any EVM or Bitcoin address for testing purposes. Replace `<address/>` with the address you want to fund. It could be a Bitcoin or Ethereum address.

### List all commands

```bash
merry --help
```

### Generate auto-completion scripts

```bash
merry completion <shell>
```

Generate auto-completion scripts for your shell. Supported shells include bash, zsh, fish, and powershell.

### Get the version of Merry

```bash
merry version
```

## Supported services

Merry supports following services:

| Service                         | Port                    |
| ------------------------------- | ----------------------- |
| Bitcoin regtest node            | localhost:18443 & 18444 |
| Bitcoin esplora frontend        | localhost:5050          |
| Bitcoin esplora electrs indexer | localhost:50000 & 30000 |
| Ethereum localnode              | localhost:8545          |
| Ethereum otterscan              | localhost:5100          |
| Arbitrum localnode              | localhost:8546          |
| Arbitrum otterscan              | localhost:5101          |
| Postgres                        | localhost:5432          |
| Redis                           | localhost:6379          |
| Orderbook                       | localhost:8080          |
| Filler                          | -                       |
