#!/bin/bash

set -exu

NODE_VERSION=10.16.0
#NPM_VERSION=6.4.1
#NODE_VERSION=4.9.0
SASS_VERSION=3.4.13
LOC="en_US.UTF-8"

shopt -s expand_aliases
alias _curl='curl -sSL'

# check if root
test $UID -eq 0

configureSystem() {
    # yes, this is really needed
    export DEBIAN_FRONTEND='noninteractive'

    apt-get -y update
    apt-get -y install apt-utils locales

    locale-gen --no-purge ${LOC}
    update-locale LANG=${LOC}
    echo "locales locales/locales_to_be_generated multiselect ${LOC} UTF-8" | debconf-set-selections
    echo "locales locales/default_environment_locale select ${LOC}" | debconf-set-selections
    dpkg-reconfigure locales

    apt-get -y upgrade
    apt-get -y --no-install-recommends install screen mc gcc g++ pkg-config make libc6-dev
    apt-get -y install git curl build-essential

    cat >> /etc/bash.bashrc <<EOF
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
EOF
}

installNodeJs() {
    # npm - install
    apt-get -y remove --purge nodejs
    apt-get -y autoremove
    rm -rf /usr/lib/node_modules

    _curl https://git.io/n-install -o n-install
    chmod +x n-install

    export N_PREFIX=/opt/n
    ./n-install -y ${NODE_VERSION}
#    export PATH+=":${N_PREFIX}/bin"
#    npm install -g npm@${NPM_VERSION}

    ln -sf ${N_PREFIX}/bin/node /usr/local/bin/node
    ln -sf ${N_PREFIX}/bin/npm /usr/local/bin/npm

    npm -v
    node -v

    npm install --global gulp-cli
    npm install gulp
    npm install gulp-sass@
    npm install gulp-autoprefixer
    npm install gulp-rename
    npm install gulp-cssnano

    ln -sf ${N_PREFIX}/bin/gulp /usr/local/bin/gulp

    gulp -v

    # cleanup
    rm -rf /tmp/npm*
}

installSCSS() {
    apt-get -y install ruby-full
    ruby -v
    gem install sass -v ${SASS_VERSION}
    sass -v
}

cleanup() {
    rm -rf /var/lib/apt/lists/*
    rm -rf /var/cache/apk/*
}

configureSystem
installSCSS
installNodeJs
cleanup
