Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "academic-platform-server"
  config.vm.network "private_network", ip: "192.168.56.10"

  # Ports forwarding pour accéder aux services depuis le navigateur Windows
  config.vm.network "forwarded_port", guest: 80,   host: 4200  # Frontend Angular
  config.vm.network "forwarded_port", guest: 8081, host: 8081  # Backend API
  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Jenkins
  config.vm.network "forwarded_port", guest: 9000, host: 9000  # SonarQube
  config.vm.network "forwarded_port", guest: 3000, host: 3000  # Grafana
  config.vm.network "forwarded_port", guest: 9090, host: 9090  # Prometheus
  config.vm.network "forwarded_port", guest: 8082, host: 8082  # Nexus
  config.vm.network "forwarded_port", guest: 8025, host: 8025  # MailHog

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "8192"  # 8 Go de RAM (Jenkins + SonarQube + App)
    vb.cpus = 4
    vb.name = "academic-platform-deploy-vm"
  end

  config.ssh.insert_key = false
end
