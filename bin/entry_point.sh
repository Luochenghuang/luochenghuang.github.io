#!/bin/bash

CONFIG_FILE=_config.yml 

# Install missing gems first
echo "Installing Jekyll gems..."
bundle install

# Start Jekyll
/bin/bash -c "rm -f Gemfile.lock && exec jekyll serve --watch --port=8080 --host=0.0.0.0 --livereload --verbose --trace --force_polling"&

while true; do

  inotifywait -q -e modify,move,create,delete $CONFIG_FILE

  if [ $? -eq 0 ]; then
 
    echo "Change detected to $CONFIG_FILE, restarting Jekyll"

    jekyll_pid=$(pgrep -f jekyll)
    kill -KILL $jekyll_pid

    # Install gems again in case dependencies changed
    bundle install
    /bin/bash -c "rm -f Gemfile.lock && exec jekyll serve --watch --port=8080 --host=0.0.0.0 --livereload --verbose --trace --force_polling"&

  fi

done
