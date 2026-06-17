#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

echo "=== Provisioning DevSecOps VM ==="

# ---- Swap de securite (RAM hote limitee a 8 Go, VM = 5 Go) ----
if [ ! -f /swapfile ]; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Securite : nettoyer une eventuelle config jenkins.list cassee d'un run precedent
# (sinon le premier "apt-get update" plante avant meme d'atteindre la correction plus bas)
rm -f /etc/apt/sources.list.d/jenkins.list /usr/share/keyrings/jenkins-keyring.gpg /usr/share/keyrings/jenkins-keyring.asc

apt-get update -y
apt-get install -y curl unzip gnupg ca-certificates apt-transport-https software-properties-common

# ---- Java 21 (headless : pas besoin de l'interface graphique, plus leger) ----
apt-get install -y openjdk-21-jdk-headless

# ---- Maven ----
apt-get install -y maven

# ---- Git ----
apt-get install -y git

# ---- Python (pre-commit) ----
apt-get install -y python3-venv python3-pip

# ---- Node.js 20 (build Angular) ----
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# ---- Docker ----
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
fi
usermod -aG docker vagrant

# ---- Jenkins ----
if ! command -v jenkins &> /dev/null; then
  curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key -o /usr/share/keyrings/jenkins-keyring.asc
  echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" > /etc/apt/sources.list.d/jenkins.list
  apt-get update -y
  apt-get install -y jenkins
fi
usermod -aG docker jenkins
systemctl enable jenkins
systemctl restart jenkins

echo "=== Provisioning termine ==="
echo "Mot de passe initial Jenkins :"
sleep 15
cat /var/lib/jenkins/secrets/initialAdminPassword || echo "Pas encore genere, attendez 30s et relancez : vagrant ssh -c 'sudo cat /var/lib/jenkins/secrets/initialAdminPassword'"
