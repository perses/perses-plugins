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
	"fmt"
	"os/exec"
	"path"

	"github.com/perses/plugins/scripts/npm"
	"github.com/sirupsen/logrus"
)

var pluginFiles = []string{
	"dist/",
	"package.json",
	"README.md",
}

func createArchive(pluginName string) error {
	manifest, err := npm.ReadManifest(pluginName)
	if err != nil {
		return err
	}
	newArchiveFolder := path.Join(pluginName, "tmp")
	for _, f := range pluginFiles {
		if execErr := exec.Command("cp", "-r", path.Join(pluginName, f), newArchiveFolder).Run(); execErr != nil {
			return fmt.Errorf("unable to copy the folder/file to the path %s: %w", f, execErr)
		}
	}

	// Then let's create the archive with the folder previously created
	archiveName := fmt.Sprintf("%s-%s.tar.gz", manifest.ID, manifest.Metadata.BuildInfo.Version)
	if execErr := exec.Command("tar", "-czvf", path.Join(pluginName, archiveName), newArchiveFolder, "--transform", fmt.Sprintf("s/%s\\/tmp/%s/", pluginName, pluginName)).Run(); execErr != nil {
		return execErr
	}

	return exec.Command("rm", "-rf", newArchiveFolder).Run()
}

func main() {
	workspaces, err := npm.GetWorkspaces()
	if err != nil {
		logrus.WithError(err).Fatal("unable to get the list of the workspaces")
	}
	for _, workspace := range workspaces {
		logrus.Infof("building archive for the plugin %s", workspace)
		if createArchiveErr := createArchive(workspace); createArchiveErr != nil {
			logrus.WithError(createArchiveErr).Fatalf("unable to generate the archive for the plugin %s", workspace)
		}
	}
}
