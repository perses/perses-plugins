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
	"os/exec"
	"path/filepath"

	"github.com/perses/plugins/scripts/npm"
	"github.com/sirupsen/logrus"
)

const schemasPath = "schemas"

func execCueEval(pluginName string, pkg string) error {
	return exec.Command("cue", "eval", filepath.Join(pluginName, schemasPath, "..."), "-p", pkg).Run()
}

// check that the CUE schemas for a given plugin are valid (= not raising errors)
func validateSchema(pluginName string) error {
	if err := execCueEval(pluginName, "model"); err != nil {
		return err
	}
	return execCueEval(pluginName, "migrate")
}

func main() {
	workspaces, err := npm.GetWorkspaces()
	if err != nil {
		logrus.WithError(err).Fatal("unable to get the list of the workspaces")
	}
	for _, workspace := range workspaces {
		logrus.Infof("validate the CUE schemas for the plugin %s", workspace)
		if validateSchemaErr := validateSchema(workspace); validateSchemaErr != nil {
			logrus.WithError(validateSchemaErr).Fatalf("schema validation failed for the plugin %s", workspace)
		}
	}
}
