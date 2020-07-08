# gapps-yEd-github

## Overview

This app acts as a redirect to the yEd-live editor and provides a download url to the yEd-live editor so that it can open a .graphml file hosted in a private Github repository.

This application is designed to be hosted in https://script.google.com as a Google Scripts App.

The code can be installed using the [gas-github Google Chrome plugin](https://github.com/leonhartX/gas-github)

## Instructions

### Setup source code

1. Install the gas-github Google Chrome plugin and login with your Github account.
1. Either request access to this repository or create a fork of this repository.
1. Go to https://script.google.com
1. Click the **New Project** button
1. Write a comment in the code to modify it
1. In the menu bar, select this repository
1. Select the branch you want to work with
1. Press the down arrow to pull the source code
1. Press the up arrow to push source code
1. Save the project by giving it a name

### Create Github app

1. Go to https://github.com/settings/applications/new
1. Create the app and register the script.google.com app url
1. Read the OAuth documentation at https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
1. Press **Register Application**
1. Save the client id and client secret in the Google script properties by going to **File > Project Properties > Script Properties**
   * Save the client secret under `client_secret`
   * Save the client id under `client_id`
   * Press **Save**
1. Create a logo (I used Inkscape)
1. Update the application

## Usage

Create a url in the following format.

`${app_script_host_url}?repo=${repository_name}&$owner=${repository_owner}&file_path=${path_to_graphml_file}`

Here is an example url

https://script.google.com/macros/s/AKfycbwdn8DvT7tmv6k-tzlR_8hxPsx_3ArdByRWufhsZ7zr_pIZF3n7/exec?repo=casechek-docs&owner=robaone&file_path=doc/assets/bill-only-services.graphml
