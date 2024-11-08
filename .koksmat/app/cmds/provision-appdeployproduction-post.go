// -------------------------------------------------------------------
// Generated by 365admin-publish
// -------------------------------------------------------------------
/*
---
title: App deploy to production
---
*/
package cmds

import (
	"context"

	"github.com/nexi-intra/magic-studio/execution"
	"github.com/nexi-intra/magic-studio/utils"
)

func ProvisionAppdeployproductionPost(ctx context.Context, args []string) (*string, error) {

	result, pwsherr := execution.ExecutePowerShell("john", "*", "magic-master", "60-provision", "10-app-service.ps1", "")
	if pwsherr != nil {
		return nil, pwsherr
	}
	utils.PrintSkip2FirstAnd2LastLines(string(result))
	return nil, nil

}
