#!/bin/bash

if [ ! -z "$INJECT_ENVS_FILE" ];
then
  inject-envs $INJECT_ENVS_FILE
fi

nginx -g "daemon off;"
