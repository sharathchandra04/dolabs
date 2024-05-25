FROM ubuntu:latest
RUN apt-get update && \
 apt-get install -y openssh-server
RUN useradd -rm -d /home/cat -s /bin/bash -g root -G sudo -u 1000 cat
RUN echo 'cat:password' | chpasswd
RUN mkdir /var/run/sshd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
