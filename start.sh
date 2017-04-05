#!/bin/sh
supervisor bin/www > ./log/log 2> ./log/error_log &
