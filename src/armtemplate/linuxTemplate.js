const customLinuxArmTemplate = (armJson) => {

    const linuxTempJson = {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "metadata": {
          "_generator": {
            "name": "bicep",
            "version": "0.14.46.61228",
            "templateHash": "996952230762016909"
          }
        },
        "parameters": {
          "vmName": {
            "type": "string",
            "defaultValue": armJson.vmName,
            "metadata": {
              "description": "The name of you Virtual Machine."
            }
          },
          "adminUsername": {
            "type": "string",
            "metadata": {
              "description": "Username for the Virtual Machine."
            }
          },
          "authenticationType": {
            "type": "string",
            "defaultValue": "password",
            "allowedValues": [
              "sshPublicKey",
              "password"
            ],
            "metadata": {
              "description": "Type of authentication to use on the Virtual Machine. SSH key is recommended."
            }
          },
          "adminPasswordOrKey": {
            "type": "securestring",
            "metadata": {
              "description": "SSH Key or password for the Virtual Machine. SSH key is recommended."
            }
          },
          "dnsLabelPrefix": {
            "type": "string",
            "defaultValue": "[toLower(format('{0}-{1}', parameters('vmName'), uniqueString(resourceGroup().id)))]",
            "metadata": {
              "description": "Unique DNS Name for the Public IP used to access the Virtual Machine."
            }
          },
          "ubuntuOSVersion": {
            "type": "string",
            "defaultValue": armJson.osDefaultVersion,
            "allowedValues": armJson.osVersion.label,
            "metadata": {
              "description": "The Ubuntu version for the VM. This will pick a fully patched image of this given Ubuntu version."
            }
          },
          "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
              "description": "Location for all resources."
            }
          },
          "vmSize": {
            "type": "string",
            "defaultValue": "Standard_D2s_v3",
            "metadata": {
              "description": "The size of the VM"
            }
          },
          "virtualNetworkName": {
            "type": "string",
            "defaultValue": armJson.virtualNetworkName,
            "metadata": {
              "description": "Name of the VNET"
            }
          },
          "subnetName": {
            "type": "string",
            "defaultValue": "Subnet",
            "metadata": {
              "description": "Name of the subnet in the virtual network"
            }
          },
          "networkSecurityGroupName": {
            "type": "string",
            "defaultValue": armJson.networkSecurityGroupName,
            "metadata": {
              "description": "Name of the Network Security Group"
            }
          },
          "securityType": {
            "type": "string",
            "defaultValue": "TrustedLaunch",
            "allowedValues": [
              "Standard",
              "TrustedLaunch"
            ],
            "metadata": {
              "description": "Security Type of the Virtual Machine."
            }
          }
        },
        "variables": {
          "imageReference": {
            "Ubuntu-1804": {
              "publisher": "Canonical",
              "offer": "UbuntuServer",
              "sku": "18_04-lts-gen2",
              "version": "latest"
            },
            "Ubuntu-2004": {
              "publisher": "Canonical",
              "offer": "0001-com-ubuntu-server-focal",
              "sku": "20_04-lts-gen2",
              "version": "latest"
            },
            "Ubuntu-2204": {
              "publisher": "Canonical",
              "offer": "0001-com-ubuntu-server-jammy",
              "sku": "22_04-lts-gen2",
              "version": "latest"
            }
          },
          "publicIPAddressName": "[format('{0}PublicIP', parameters('vmName'))]",
          "networkInterfaceName": "[format('{0}NetInt', parameters('vmName'))]",
          "osDiskType": "Standard_LRS",
          "subnetAddressPrefix": "10.1.0.0/24",
          "addressPrefix": "10.1.0.0/16",
          "linuxConfiguration": {
            "disablePasswordAuthentication": true,
            "ssh": {
              "publicKeys": [
                {
                  "path": "[format('/home/{0}/.ssh/authorized_keys', parameters('adminUsername'))]",
                  "keyData": "[parameters('adminPasswordOrKey')]"
                }
              ]
            }
          },
          "securityProfileJson": {
            "uefiSettings": {
              "secureBootEnabled": true,
              "vTpmEnabled": true
            },
            "securityType": "[parameters('securityType')]"
          },
          "extensionName": "GuestAttestation",
          "extensionPublisher": "Microsoft.Azure.Security.LinuxAttestation",
          "extensionVersion": "1.0",
          "maaTenantName": "GuestAttestation",
          "maaEndpoint": "[substring('emptystring', 0, 0)]"
        },
        "resources": [
          {
            "type": "Microsoft.Network/networkInterfaces",
            "apiVersion": "2021-05-01",
            "name": "[variables('networkInterfaceName')]",
            "location": "[parameters('location')]",
            "properties": {
              "ipConfigurations": [
                {
                  "name": "ipconfig1",
                  "properties": {
                    "subnet": {
                      "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnetName'))]"
                    },
                    "privateIPAllocationMethod": "Dynamic",
                    "publicIPAddress": {
                      "id": "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))]"
                    }
                  }
                }
              ],
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('networkSecurityGroupName'))]"
              }
            },
            "dependsOn": [
              "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('networkSecurityGroupName'))]",
              "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))]",
              "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnetName'))]"
            ]
          },
          {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2021-05-01",
            "name": "[parameters('networkSecurityGroupName')]",
            "location": "[parameters('location')]",
            "properties": {
              "securityRules": [
                {
                  "name": "SSH",
                  "properties": {
                    "priority": 1000,
                    "protocol": "Tcp",
                    "access": "Allow",
                    "direction": "Inbound",
                    "sourceAddressPrefix": "*",
                    "sourcePortRange": "*",
                    "destinationAddressPrefix": "*",
                    "destinationPortRange": "22"
                  }
                }
              ]
            }
          },
          {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2021-05-01",
            "name": "[parameters('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "properties": {
              "addressSpace": {
                "addressPrefixes": [
                  "[variables('addressPrefix')]"
                ]
              }
            }
          },
          {
            "type": "Microsoft.Network/virtualNetworks/subnets",
            "apiVersion": "2021-05-01",
            "name": "[format('{0}/{1}', parameters('virtualNetworkName'), parameters('subnetName'))]",
            "properties": {
              "addressPrefix": "[variables('subnetAddressPrefix')]",
              "privateEndpointNetworkPolicies": "Enabled",
              "privateLinkServiceNetworkPolicies": "Enabled"
            },
            "dependsOn": [
              "[resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworkName'))]"
            ]
          },
          {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2021-05-01",
            "name": "[variables('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "sku": {
              "name": "Basic"
            },
            "properties": {
              "publicIPAllocationMethod": "Dynamic",
              "publicIPAddressVersion": "IPv4",
              "dnsSettings": {
                "domainNameLabel": "[parameters('dnsLabelPrefix')]"
              },
              "idleTimeoutInMinutes": 4
            }
          },
          {
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2021-11-01",
            "name": "[parameters('vmName')]",
            "location": "[parameters('location')]",
            "properties": {
              "hardwareProfile": {
                "vmSize": "[parameters('vmSize')]"
              },
              "storageProfile": {
                "osDisk": {
                  "createOption": "FromImage",
                  "managedDisk": {
                    "storageAccountType": armJson.storageAccountName
                  }
                },
                "imageReference": "[variables('imageReference')[parameters('ubuntuOSVersion')]]"
              },
              "networkProfile": {
                "networkInterfaces": [
                  {
                    "id": "[resourceId('Microsoft.Network/networkInterfaces', variables('networkInterfaceName'))]"
                  }
                ]
              },
              "osProfile": {
                "computerName": "[parameters('vmName')]",
                "adminUsername": "[parameters('adminUsername')]",
                "adminPassword": "[parameters('adminPasswordOrKey')]",
                "linuxConfiguration": "[if(equals(parameters('authenticationType'), 'password'), null(), variables('linuxConfiguration'))]"
              },
              "securityProfile": "[if(equals(parameters('securityType'), 'TrustedLaunch'), variables('securityProfileJson'), json('null'))]"
            },
            "dependsOn": [
              "[resourceId('Microsoft.Network/networkInterfaces', variables('networkInterfaceName'))]"
            ]
          },
          {
            "condition": "[and(equals(parameters('securityType'), 'TrustedLaunch'), and(equals(variables('securityProfileJson').uefiSettings.secureBootEnabled, true()), equals(variables('securityProfileJson').uefiSettings.vTpmEnabled, true())))]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2022-03-01",
            "name": "[format('{0}/{1}', parameters('vmName'), variables('extensionName'))]",
            "location": "[parameters('location')]",
            "properties": {
              "publisher": "[variables('extensionPublisher')]",
              "type": "[variables('extensionName')]",
              "typeHandlerVersion": "[variables('extensionVersion')]",
              "autoUpgradeMinorVersion": true,
              "settings": {
                "AttestationConfig": {
                  "MaaSettings": {
                    "maaEndpoint": "[variables('maaEndpoint')]",
                    "maaTenantName": "[variables('maaTenantName')]"
                  }
                }
              }
            },
            "dependsOn": [
              "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
            ]
          }
        ],
        "outputs": {
          "adminUsername": {
            "type": "string",
            "value": "[parameters('adminUsername')]"
          },
          "hostname": {
            "type": "string",
            "value": armJson.vmName
          },
          "sshCommand": {
            "type": "string",
            "value": "[format('ssh {0}@{1}', parameters('adminUsername'), reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName')), '2021-05-01').dnsSettings.fqdn)]"
          }
        }
      }

      return linuxTempJson;

}

export default customLinuxArmTemplate