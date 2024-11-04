package magicapp

import (
	"github.com/spf13/cobra"

	"github.com/nexi-intra/magic-studio/utils"
)

func RegisterServiceCmd() {
	natsCmd := &cobra.Command{
		Use:   "service",
		Short: "Start the Micro Service responder",

		Run: func(cmd *cobra.Command, args []string) {
			StartMicroService()
		},
	}
	utils.RootCmd.AddCommand(natsCmd)
}
