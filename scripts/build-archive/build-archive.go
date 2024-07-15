package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path"

	"github.com/sirupsen/logrus"
)

type npmPackage struct {
	Workspaces []string `json:"workspaces"`
}

type manifest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func createArchive(archivePath string) error {
	distPath := path.Join(archivePath, "dist")
	manifestFilePath := path.Join(distPath, "mf-manifest.json")
	data, err := os.ReadFile(manifestFilePath)
	if err != nil {
		return err
	}
	manifestData := manifest{}
	if unmarshalErr := json.Unmarshal(data, &manifestData); unmarshalErr != nil {
		return err
	}
	newArchiveFolder := path.Join(archivePath, manifestData.ID)
	if execErr := exec.Command("cp", "-r", distPath, newArchiveFolder).Run(); execErr != nil {
		return execErr
	}
	if execErr := exec.Command("tar", "-czvf", path.Join(archivePath, fmt.Sprintf("%s.tar.gz", manifestData.ID)), newArchiveFolder).Run(); execErr != nil {
		return execErr
	}
	return exec.Command("rm", "-rf", newArchiveFolder).Run()
}

func main() {
	data, err := os.ReadFile("package.json")
	if err != nil {
		logrus.Fatal(err)
	}
	pkg := npmPackage{}
	if unmarshalErr := json.Unmarshal(data, &pkg); unmarshalErr != nil {
		logrus.Fatal(unmarshalErr)
	}
	for _, workspace := range pkg.Workspaces {
		logrus.Infof("building archive for the plugin %s", workspace)
		if createArchiveErr := createArchive(workspace); createArchiveErr != nil {
			logrus.Fatal(err)
		}
	}
}
