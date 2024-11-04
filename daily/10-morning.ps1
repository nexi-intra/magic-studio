# Get the access token using az CLI for Microsoft Graph
$accessToken = az account get-access-token --resource https://graph.microsoft.com --query accessToken --output tsv az account  --scope "RoleManagement.ReadWrite.Directory"
$accessToken
return
# Define the Graph API endpoint
$graphApiUrl = "https://graph.microsoft.com/v1.0/roleManagement/directory/roleEligibilityScheduleInstances"

# Create the headers for the API call, including the Authorization with Bearer token
$headers = @{
  "Authorization" = "Bearer $accessToken"
  "Content-Type"  = "application/json"
}

# Make a GET request to the Microsoft Graph API
$response = Invoke-RestMethod -Uri $graphApiUrl -Headers $headers -Method Get

# Output the response (this will list your eligible roles)
$response
# Write-Host "Installing AzureAD module"
# #Install-Module AzureAD
# Write-Host "Installing Microsoft.Graph module"
# #Install-Module Microsoft.Graph -Scope CurrentUser -force
# Write-Host "Importing Microsoft.Graph module"
# Import-Module Microsoft.Graph
# write-host "Connecting to Azure"
# #Connect-AzAccount


# # Login to Azure
# Connect-MgGraph -Scopes "RoleManagement.ReadWrite.Directory"


# #$user = Get-AzADUser -UserPrincipalName (Get-AzAccessToken).UserId
# $userId = "admin-ngjoh@nets.eu" #  $user.ObjectId


# write-host "Getting roles"
# # Get eligible PIM roles
# # $eligibleRoles =

# Get-MgRoleManagementDirectoryRoleEligibilityScheduleRequest  -UserPrincipalName $userId

# # Activate eligible role
# #$activateRole = New-MgRoleManagementDirectoryRoleAssignmentScheduleRequest -RoleDefinitionId <role-definition-id> -PrincipalId $userId -DirectoryScopeId "/"

# # Confirm activation
# #Get-MgRoleManagementDirectoryRoleAssignmentScheduleRequest -UserId <your-user-id>