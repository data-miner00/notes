---
title: Vagrant
description: A deterministic, repeatable way of managing virtual machines on cloud and locally
topic: DevOps
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - vm
  - iac
  - infra
updatedAt: 2024-11-14T12:36:20.276Z
createdAt: 2024-11-14T12:36:20.276Z
---

Vagrant is a tool to automate the process of provisioning virtual machines (VMs). It was initially developed by Mitchell Hashimoto, the founder of Hashicorp as a personal side project back in 2010.

<!--more-->

## Providers

Providers are the virtualization technology that Vagrant can to deploy and configure VM natively.

Here is a list of supported Vagrant providers.

- [Virtualbox](https://www.virtualbox.org/)
- [Docker](https://www.docker.com/)
- [EC2](https://aws.amazon.com/pm/ec2/)
- [OpenStack](https://www.openstack.org/)
- [DigitalOcean](https://www.digitalocean.com/)
- [Azure](https://azure.microsoft.com/en-us)
- [Google](https://cloud.google.com/)
- [VMWare](https://www.vmware.com/)
- [Hyper-V](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)
- [Vultr](https://www.vultr.com/)
- [Qemu](https://www.qemu.org/)

## Box

Box are essentially **images** of the VM that can be deployed. Vagrant have its own repository that contains a wide array of boxes created by officials or the community that can be used for deployment.

Boxes can be discovered/browsed through the [Hashicorp Portal](https://portal.cloud.hashicorp.com/vagrant/discover).

Some of the example boxes are

- `centos/7`
- `generic/gentoo`
- `ubuntu/xenial64`
- `hashicorp/precise64`
- `archlinux/archlinux`

## Vagrantfile

Vagrantfile is the file that contains all configurations for a VM that Vagrant uses for deployment. The file is written in [Ruby syntax](https://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html).

This is the bare minimum Vagrantfile that specifies `centos/7` to be used as the image for creating the VM.

```rb [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
end
```

Using `vagrant init centos/7` will scaffold a heavily commented Vagrantfile for CentOS that it helpful for beginners to go through. Here are more [examples](https://github.com/patrickdlee/vagrant-examples/) for how a Vagrantfile can be configured.

To validate a Vagrantfile, run the `validate` command.

```
vagrant validate
```

## Provisioner

Provisioner is the medium that sets up the VM after they have been created. It wouldn't be that useful to create an empty VM without the necessary tools and software installed.

- [Ansible](https://www.ansible.com/)
- Puppet
- Chef
- Salt
- Raw scripts (e.g Bash)

### Shell Scripts

In the shell provisioning block, we can provide inline shell commands that will be executed upon creation/edit.

```ruby [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision "shell", inline: <<-SHELL
    echo hello from shell!
    sudo yum update -y
    sudo yum install -y httpd
  SHELL
end
```

Alternatively, we can have a separate shell script that can be referenced in the Vagrantfile to achieve the same thing.

```sh [provision.sh]
#!/bin/bash

echo hello from shell!
sudo yum update -y
sudo yum install -y httpd
```

The `provision.sh` script can be referenced as such:

```ruby [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision "shell", path: "provision.sh"
end
```

More details about using shell as the provisioner can be found on the [official documentation](https://developer.hashicorp.com/vagrant/docs/provisioning/shell).

## Next Steps

After having the Vagrantfile generated and configured, run `vagrant up` to start the VM. For first time execution, it will download the box specified (image) from the official repository first before creating and running the VM.

When the VM have been created and running, run `vagrant ssh` to ssh into the VM. To quit the VM from the SSH, type `exit` in the command line. To stop the VM, run `vagrant halt` to gracefully shutdown the VM.

## Basic Commands

This section shows a few common commands of the Vagrant CLI.

### Vagrant Commands

| Commands                 | Description                                                       | Example                                  |
| ------------------------ | ----------------------------------------------------------------- | ---------------------------------------- |
| vagrant init             | Creates a new Vagrantfile                                         | vagrant init centos/7                    |
| vagrant up               | Downloads and spinup the machines                                 |                                          |
| vagrant ssh              | SSH into the guest machine                                        |                                          |
| vagrant ssh-config       | Outputs OpenSSH valid configuration to connect to the VMs via SSH |                                          |
| vagrant halt             | Stops the VMs                                                     |                                          |
| vagrant suspend          | Suspends the guest machines                                       |                                          |
| vagrant resume           | Resumes the suspended machines                                    |                                          |
| vagrant reload           | Restarts the VMs                                                  |                                          |
| vagrant destroy          | Stop and removes all the VMs                                      |                                          |
| vagrant status           | Shows the status of the current Vagrant environment               |                                          |
| vagrant package          | Packages a running virtual environment into a reusable box        |                                          |
| vagrant provision        | Runs any configured provisioners against the running VM           |                                          |
| vagrant plugin install   | Installs a vagrant plugin                                         | vagrant plugin install vagrant-vbguest   |
| vagrant plugin list      | Lists all installed plugins                                       |                                          |
| vagrant plugin uninstall | Uninstalls a plugin                                               | vagrant plugin uninstall vagrant-vbguest |

### Vagrant Box Commands

| Commands              | Description                                                   | Example                                             |
| --------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| vagrant box add       | Add a box to local box repository                             | vagrant box add centos/7                            |
| vagrant box list      | Lists all boxes in your local box repository                  |                                                     |
| vagrant box outdated  | Checks if any boxes in your local box repository are outdated |                                                     |
| vagrant box update    | Updates a box to a new version                                | vagrant box update centos/7                         |
| vagrant box repackage | Repackages a box with a new name and metadata                 | vagrant box repackage centos/7 --name custom-centos |
| vagrant box prune     | Removes outdated boxes from your local box repository         |                                                     |
| vagrant box remove    | Removes a box from your local box repository                  | vagrant box remove centos/7                         |

## VirtualBox as Provider

When using VirtualBox as a provider for Vagrant, this are some useful commands for inspecting the VMs.

- List all the VMs

```
vboxmanage list vms
```

- List all the running VMs

```
vboxmanage list runningvms
```

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Pal, R # Raghav Pal
title: Vagrant Beginner Tutorial
url: https://www.youtube.com/playlist?list=PLhW3qG5bs-L9S272lwi9encQOL9nMOnRa
date: 2023, April 22
source: websites
---
::

::apa-reference
---
organization: Hashicorp
title: Introduction to Vagrant
url: https://developer.hashicorp.com/vagrant/intro
retrievedDate: 2024, November 14
source: websites
---
::

::apa-reference
---
publisher: Wikipedia
title: Vagrant (software)
url: https://en.wikipedia.org/wiki/Vagrant_(software)
retrievedDate: 2024, November 14
source: websites
---
::

::apa-reference
---
organization: Hashicorp
title: Shell Provisioner
url: https://developer.hashicorp.com/vagrant/docs/provisioning/shell
retrievedDate: 2024, November 14
source: websites
---
::
<!-- prettier-ignore-end -->
