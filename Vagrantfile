Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "devsecops-server"

  # Acces aux services via localhost (pas de carte reseau privee : evite les blocages
  # de configuration reseau au boot sur VirtualBox 7.x + Windows 11)
  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Jenkins
  config.vm.network "forwarded_port", guest: 9000, host: 9000  # SonarQube
  config.vm.network "forwarded_port", guest: 8081, host: 8081  # Nexus
  config.vm.network "forwarded_port", guest: 9090, host: 9090  # Prometheus
  config.vm.network "forwarded_port", guest: 3000, host: 3000  # Grafana
  config.vm.network "forwarded_port", guest: 8089, host: 8089  # Backend Spring Boot
  config.vm.network "forwarded_port", guest: 8088, host: 8088  # Frontend Angular

  config.vm.boot_timeout = 600

  config.vm.provider "virtualbox" do |vb|
    # ATTENTION : PC avec 8 Go RAM au total et peu de RAM libre reellement disponible.
    vb.memory = "2048"
    vb.cpus = 2
    vb.name = "academic-platform-devsecops-vm"
  end

  config.vm.provision "shell", path: "devops/provision.sh"
end
