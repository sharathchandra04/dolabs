FROM ubuntu:latest
RUN apt-get update && \
 apt-get install -y openssh-server
RUN useradd -rm -d /home/dog -s /bin/bash -g root -G sudo -u 1000 dog
RUN echo 'dog:password' | chpasswd
RUN mkdir /var/run/sshd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
