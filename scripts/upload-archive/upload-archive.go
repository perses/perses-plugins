// Copyright 2024 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"flag"
	"fmt"
	"os/exec"
	"path"
	"regexp"

	"github.com/perses/perses-plugins/scripts/npm"
	"github.com/sirupsen/logrus"
)

var tagNamePattern = regexp.MustCompile(`(?m)(.*)-\d.\d.\d`)

func main() {
	tag := flag.String("tag", "", "Name of the tag")
	flag.Parse()
	tagSplitted := tagNamePattern.FindStringSubmatch(*tag)
	if len(tagSplitted) != 2 {
		logrus.Fatalf("Invalid tag name: %s", *tag)
	}
	pluginName := tagSplitted[1]
	manifest, err := npm.ReadManifest(pluginName)
	if err != nil {
		logrus.Fatal(err)
	}
	if execErr := exec.Command("gh", "release", "upload", *tag, path.Join(pluginName, fmt.Sprintf("%s.tar.gz", manifest.ID))).Run(); execErr != nil {
		logrus.WithError(err).Fatalf("unable to upload archive %s", pluginName)
	}
}
