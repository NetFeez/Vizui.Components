#!/bin/bash

if npx dep install > .compile.log 2>&1; then
    echo -e "\x1B[32mDependencies installed successfully.\x1B[0m"
else
    echo -e "\x1B[31mFailed to install \x1B[36]'depflow'\x1B[31m dependencies.\x1B[0m"
    tail .compile.log
    exit 1
fi

if npx tsc --pretty > .compile.log 2>&1; then
    echo -e "\x1B[32mTypeScript compiled successfully.\x1B[0m"
else
    echo -e "\x1B[31mFailed to compile TypeScript.\x1B[0m"
    tail .compile.log
  exit 1
fi