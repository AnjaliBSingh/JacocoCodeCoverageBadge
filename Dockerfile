FROM    centos:centos6

MAINTAINER n7down@gmail.com

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN yum install -y epel-release

# Install Node.js and npm
RUN yum install -y nodejs npm

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install --production

# Bundle app source
COPY . /src

ENV JACOCO_URL localhost:80/jacoco

EXPOSE  8080

CMD node /src/server.js ${JACOCO_URL}
