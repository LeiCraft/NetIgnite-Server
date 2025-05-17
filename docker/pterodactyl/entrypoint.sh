#!/bin/bash

function check_cpu_arch {
    local arch=$(uname -m)
    if [ "$arch" = "x86_64" ]; then
        declare -g ARCH="linux_amd64"
    elif [ "$arch" = "aarch64" ]; then
        declare -g ARCH="linux_arm64"
    else
        echo "Unsupported architecture: $arch"
        exit 1
    fi
}

function extract_env_bool {
    local var_name=$1
    if [[ "${!var_name}" == "1" ]]; then
        eval "$var_name=true"
    else
        eval "$var_name=false"
    fi
}

function get_latest_version {
    local include_prereleases=$1
    local api_url="https://api.github.com/repos/leicraft/netignite-server/releases"

    # Fetch releases from GitHub API
    local releases_json=$(curl -s "$api_url")

    if [ "$include_prereleases" == "true" ]; then
        # Include prereleases
        echo "$releases_json" | jq -r '.[0].tag_name'
    else
        # Exclude prereleases, find the first stable release
        echo "$releases_json" | jq -r '[.[] | select(.prerelease == false)][0].tag_name'
    fi
}

function get_current_version {
    local version=$(./netignite-server --help 2>/dev/null)
    echo "$version" | sed -n 's/^ntfy \([0-9]\+\.[0-9]\+\.[0-9]\+\).*/\1/p'
}

function download_ntfy {
    local version=$1
    local arch=$2
    local name="ntfy_$(echo $version | cut -c2-)_${arch}"
    local url="https://github.com/leicraft/netignite-server/releases/download/${version}/${name}.tar.gz"

    echo "Downloading NetIgnite-Server version $version for architecture $arch..."

    http_response_code="$(curl --write-out '%{http_code}' -sL -o $name.tar.gz "$url")"

    if [ "$http_response_code" != "200" ]; then
        echo "Failed to download NetIgnite-Server binary. HTTP response code: $http_response_code"
        exit 1
    fi

    echo "Download complete. Extracting..."
    tar zxvf "${name}.tar.gz"
    if [ $? -ne 0 ]; then
        echo "Failed to extract NetIgnite-Server binary."
        exit 1
    fi
    
    cp -a ${name}/netignite-server /home/container/netignite-server
    chmod +x /home/container/netignite-server

    cp -n ${name}/{client,server}/*.yml /home/container/conf

    rm "${name}.tar.gz"
    rm -rf $name

    echo "NetIgnite-Server $version downloaded successfully."
}

function create_directories {
    mkdir -p /home/container/conf
    mkdir -p /home/container/logs
    mkdir -p /home/container/data
    mkdir -p /home/container/cache
    mkdir -p /home/container/certs
}

function main {

    echo "Starting..."

    cd /home/container

    check_cpu_arch

    # Extract Startup CMD
    STARTUP_CMD=$(echo ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')
    extract_env_bool EXPERIMENTAL
    
    create_directories

    LOCAL_VERSION=$(get_current_version)

    if [ "$VERSION" == "latest" ]; then
        
        REMOTE_VERSION=$(get_latest_version $EXPERIMENTAL)

        if [ "$REMOTE_VERSION" != "v$LOCAL_VERSION" ]; then
            echo "New version available: $REMOTE_VERSION. Downloading..."
            download_ntfy $REMOTE_VERSION $ARCH
        else
            echo "The latest version is already installed. Continuing..."
        fi
    else
        
        if [[ "v$VERSION" != "v$LOCAL_VERSION" ]]; then
            echo "Requested version $VERSION is not installed. Downloading..."
            download_ntfy v$VERSION $ARCH
        else
            echo "Requested version $VERSION is already installed. Continuing..."
        fi

    fi

    eval ${STARTUP_CMD}
}

main

