#!/bin/bash

set -o pipefail
set -o nounset
set -m

# TODO
# hub
# - Update tarball for faster times (snapshot update as day 2 ops)
# spoke
# - mirror the remaining updates

# variables
# #########
# uncomment it, change it or get it from gh-env vars (default behaviour: get from gh-env)
# export KUBECONFIG=/root/admin.kubeconfig

# Load common vars
source ${WORKDIR}/shared-utils/common.sh
source ./common.sh hub

MODE=${1}

SNAPSHOTFILE="mirror-snapshot.tgz"
HTTPSERVICE=$(oc --kubeconfig=${KUBECONFIG_HUB} get routes -n default | grep httpd-server-route | awk '{print $2}')
DOCKERPATH="/var/lib/registry/docker"

if [[ ${MODE} == 'hub' ]]; then

    REGISTRY_POD=$(oc get pod -n ${REGISTRY} -l name=${REGISTRY} -oname|head -1|cut -d "/" -f2-)
    HTTPD_POD=$(oc get pod -n default -oname |grep nginx|head -1|cut -d "/" -f2-)

    # Execute from node with the http and store in NGINX path

    oc --kubeconfig=${KUBECONFIG_HUB} -n default rsh ${HTTPD_POD} "\"oc --kubeconfig=${KUBECONFIG_HUB} exec -i -n ${REGISTRY} ${REGISTRY_POD} -- tar czf - -C ${DOCKERPATH} > /var/share/nginx/html/${SNAPSHOTFILE}"\"
    
elif [[ ${MODE} == 'spoke' ]]; then
    if [[ -z ${ALLSPOKES} ]]; then
        ALLSPOKES=$(yq e '(.spokes[] | keys)[]' ${SPOKES_FILE})
    fi

    # Get HTTPD path (common for all spokes)
    URL="http://${HTTPSERVICE}/${SNAPSHOTFILE}"

    for spoke in ${ALLSPOKES}; do
        # Restore
        echo "spoke: ${spoke}"
        if [[ ! -f "${OUTPUTDIR}/kubeconfig-${spoke}" ]]; then
            extract_kubeconfig ${spoke}
        else
            export SPOKE_KUBECONFIG="${OUTPUTDIR}/kubeconfig-${spoke}"
        fi
                
        # Run on the target registry the command to download and uncompress the snapshot
        oc exec --kubeconfig=${SPOKE_KUBECONFIG} -n ${REGISTRY} ${REGISTRY_POD} -- "curl ${URL} | tar xvf - -C ${DOCKERPATH}"
        
    done
fi


