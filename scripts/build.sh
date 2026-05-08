#!/bin/bash

set -eo pipefail
outputFile="output.log"

if npx dep install > $outputFile 2>&1; then
    echo -e "\x1B[32mDependencies installed successfully.\x1B[0m"
else
    echo -e "\x1B[31mFailed to install \x1B[36]'depflow'\x1B[31m dependencies.\x1B[0m"
    tail $outputFile
    exit 1
fi

if npx tsc > $outputFile 2>&1; then
    echo -e "\x1B[32mTypeScript compiled successfully.\x1B[0m"
else
    echo -e "\x1B[31mFailed to compile TypeScript.\x1B[0m"
    tail $outputFile
    exit 1
fi

rm -f $outputFile