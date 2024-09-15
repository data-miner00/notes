---
title: Secure Shell (SSH)
topic: General
description: A quick and simple introduction to SSH and practical usage
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - protocol
  - ssh
  - remote
updatedAt: 2024-09-13T14:45:26.489Z
createdAt: 2024-09-13T14:45:26.489Z
---

Secure Shell (SSH) is a cryptographic protocol that enables **secure communication** between two devices over an **unsecured network**. It is used for remote login, command execution and file transfer.

<!--more-->

SSH operates in a [server-client architecture](https://en.wikipedia.org/wiki/Client%E2%80%93server_model) where authentication can be performed from the client side via password login or public/private key pairs.

## Server

The server is the target machine that is ready for any client to connect to. In Linux, the SSH daemon (also known as sshd) is required to turn the machine into a SSH server.

### Installation

SSH can be installed via the `openssh` package that is available to most Linux distributions. Before the installation, perform a quick check whether `openssh` is already installed.

```sh
ssh
```

If it is already installed, the help text will be printed to the console.

```
usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]
           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]
           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]
           [-i identity_file] [-J [user@]host[:port]] [-L address]
           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]
           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]
           [-w local_tun[:remote_tun]] destination [command [argument ...]]
```

If it has not been installed yet, just find the relevant package to install based on the distribution package repository. Here are some examples of how to install `openssh` in Ubuntu and Arch Linux. In Ubuntu, the functionality for client and server are packaged separately whereas it is [all-in-one](https://archlinux.org/packages/?q=openssh) in Arch Linux.

```shell
# Ubuntu
sudo apt-get install openssh-server openssh-client

# Arch Linux
sudo pacman -S openssh
```

To install SSH in Windows, refer to this [guide](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui&pivots=windows-server-2025) on MSDN.

### Enable/Start SSH

SSH daemon can be controller by `systemctl` to start, stop, restart, enable or disable.

```
sudo systemctl start sshd.service
```

### Unblock Firewall

For machines that have firewall installed, it is required to open the port 22 for SSH inbound connection.

```
sudo ufw allow ssh
```

### Retrieve IP

IP address of the target machine is required to use SSH from the client machine. If the machine falls under the same network, i.e. connecting to the same Wi-Fi, then local IP will do the job. To get the IP address for the local network in Linux, run the following `ip` command.

```
ip a
```

This will print the information about the network including the local IP address.

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: eno1: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 80:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
    altname enp3s0
3: wlo1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 40:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
    altname wlp2s0
    inet 192.168.68.114/24 brd 192.168.68.255 scope global dynamic noprefixroute wlo1
       valid_lft 6915sec preferred_lft 6915sec
    inet6 fe80::aaaa:aaaa:aaaa:aaaa/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

## Client

Client is the machine that will be connecting to the SSH server via the command line. To connect to the server machine, we use the SSH command shown below. Replace the `<username>` and `<ip-address>` with the appropriate info.

```
ssh <username>@<ip-address>
```

If the machine and user are successfully validated, it will prompt for the password for that particular user to sign in. When we successfully SSH into the machine for the first time, there will be a warning message that asks us to trust the host. Enter `yes` and we are good to go.

```
The authenticity of host '192.168.68.114 (192.168.68.114)' can't be established.
ED25519 key fingerprint is SHA256:vEM3bnZJ09HNs4NnxxxxxxxxxxxxxxxxxxxxxxJuJ9Y.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

Here is the screenshot of using [MobaXTerm](https://mobaxterm.mobatek.net/) from my Windows 10 machine to SSH into my Arch Linux laptop. I like MobaXTerm as it comes with lots of useful feature such as SSH out of the box.

![Successful login with MobaXTerm](/images/secure-shell/mobax1.png)

Unbeknownst to me, my Neovim theme and configuration plays nicely too. Not to mention the [language server protocol](https://en.wikipedia.org/wiki/Language_Server_Protocol) is also active while I am editing the codes.

![Active LSP when editing Clojure codes](/images/secure-shell/mobax2.png)

## View Logins

Logs for the SSH logins can be retrieved via `journalctl`, the utility to query structured logs from systemd's logging service.

```
journalctl -u sshd
```

This will display the detailed logs for each login via the SSH to the server machine. Read more on the different parameters that can be used for querying the logs in this [article](https://www.strongdm.com/blog/view-ssh-logs).

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: Secure Shell
url: https://en.wikipedia.org/wiki/Secure_Shell
retrievedDate: 2024, September 13
source: websites
publisher: Wikipedia
---
::

::apa-reference
---
authors:
 - Gite, V # Vivek Gite
title: Linux start sshd (OpenSSH) server command
url: https://www.cyberciti.biz/faq/linux-start-sshd-openssh-server-command/
date: 2024, March 31
source: websites
---
::

::apa-reference
---
authors:
 - Todd, E # Evan Todd
title: How to View SSH Logs?
url: https://www.strongdm.com/blog/view-ssh-logs
date: 2023, January 24
source: websites
---
::

::apa-reference
---
authors:
 - Terpollari, O # Oltjano Terpollari
title: How to Install OpenSSH Server In Linux
url: https://www.tecmint.com/install-openssh-server-in-linux/
date: 2023, April 24
source: websites
---
::
<!-- prettier-ignore-end -->
