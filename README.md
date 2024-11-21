# Perses Plugins

This repository contains the core plugins for [Perses](https://github.com/perses/perses)

## Build locally

### Get backend schemas dependencies

Most if not all the plugins schemas rely on the [`common` CUE package of the perses/perses repo](https://github.com/perses/perses/tree/main/cue/schemas/common). To be able to evaluate the CUE model of a given plugin locally, you thus need to make this package available as en external CUE dependency for it. In the future this is something where you'd just have to run `cue get` (in the same way as `go get` for Golang libs), but for now you have to rely on an utility we provide through percli: `percli plugin update`.
