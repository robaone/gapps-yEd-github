# 2. application workflow

Date: 2020-06-26

## Status

Accepted

## Context

[yEd live editor](https://www.yworks.com/yed-live) is designed to edit `.graphml` files.  It has the ability to load files from a url that is provided via the `file` url parameter.
However, if `.graphml` files are hosted in a private GitHub repository, the url will have to include an access token which is unique to the user.

The purpose of the application is to allow a user to open a `.graphml` file hosted in a private GitHub repository and have it open in the yEd live editor using a url that includes the Github access token.

## Decision

The change that we're proposing or have agreed to implement.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
