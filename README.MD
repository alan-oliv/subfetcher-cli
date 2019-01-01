# Subfecther CLI

If you have a media center using PLEX or another software and don't like searching for subtitles to watch foreign movies, subfetcher will do that for you.

## Quick overview

If you like to run locally, clone the repo and in the root folder type:

```bash
npm i -g ./
```

## Usage
Subfecther has two different approaches, you can run the cli passings the required parameters, or run without any and it'll ask the desired settings for you.

```
$ subfetcher --help
Usage: subfetcher [options]

Options:
  -V, --version                                          output the version number
  -f, --path <required>                                  Tell me the path to your movies!
  -e, --extensions <required> (string, comma separated)  Extensions that your movies are
  -l, --languages <required> (string, comma separated)   Desired subtitles languages
  -c, --client <required> (string)                       Name of the desired search client
  -h, --help                                             output usage information
```

### Get Started Immediately
If you don't want to contribute and just want to use subfetcher for personal purposes, you can get the binaries and start using it right away!

## Roadmap
- Handle client errors on fecthing methods
- After first use, save settings on file and ask if the user want to repeat the same configuration.
- Detect if folder already have subtitles and ask if you want to overwrite it or not
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
e
