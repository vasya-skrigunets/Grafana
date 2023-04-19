var express = require('express')

var app = express()

app.post('/fba/inbound/v0/plans/', function(req,res){
    res.send(
        {
            "ShipFromAddress": {
              "Name": "string",
              "AddressLine1": "705 Boulder Drive",
              "AddressLine2": "105 Boulder Drive",
              "DistrictOrCounty": "string",
              "City": "Breinigsville",
              "StateOrProvinceCode": "PA",
              "CountryCode": "string",
              "PostalCode": "string"
            },
            "LabelPrepPreference": "SELLER_LABEL",
            "ShipToCountryCode": "string",
            "ShipToCountrySubdivisionCode": "string",
            "InboundShipmentPlanRequestItems": [
              {
                "SellerSKU": "SKU-123",
                "ASIN": "16074592FB",
                "Condition": "NewItem",
                "Quantity": 0,
                "QuantityInCase": 0,
                "PrepDetailsList": [
                  {
                    "PrepInstruction": "Polybagging",
                    "PrepOwner": "AMAZON"
                  }
                ]
              }
            ]
        }
    )
})

app.post('/fba/inbound/v0/shipmants/:id', (req,res)=>{
    res.send(
        {
            "payload": {
              "ShipmentId": "123456"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
          }
    )
})

app.put('/fba/inbound/v0/shipmants/:id', (req,res)=>{
    res.send(
        {
            "payload": {
              "ShipmentId": "123456"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
          }
    )
})

app.get('/fba/inbound/v0/shipmants/:id/preorder', (req,res)=>{
    res.send(
        {
            "payload": {
              "ShipmentContainsPreorderableItems": true,
              "ShipmentConfirmedForPreorder": true,
              "NeedByDate": "2021-11-04",
              "ConfirmedFulfillableDate": "2021-11-04"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipmants/:id/preorder', (req,res)=>{
    res.send(
        {
            "payload": {
              "ShipmentContainsPreorderableItems": true,
              "ShipmentConfirmedForPreorder": true,
              "NeedByDate": "2021-11-04",
              "ConfirmedFulfillableDate": "2021-11-04"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.put('/fba/inbound/v0/shipmants/:id/preorder/confirm', (req,res)=>{
    res.send(
        {
            "payload": {
              "ConfirmedNeedByDate": "2021-11-04",
              "ConfirmedFulfillableDate": "2021-11-04"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/prepInstructions', (req,res)=>{
    res.send(
        {
            "payload": {
              "SKUPrepInstructionsList": [
                {
                  "SellerSKU": "SKU-123",
                  "ASIN": "16074592FB",
                  "BarcodeInstruction": "RequiresFNSKULabel",
                  "PrepGuidance": "ConsultHelpDocuments",
                  "PrepInstructionList": [
                    "Polybagging"
                  ],
                  "AmazonPrepFeesDetailsList": [
                    {
                      "PrepInstruction": "Polybagging",
                      "FeePerUnit": {
                        "CurrencyCode": "USD",
                        "Value": 0
                      }
                    }
                  ]
                }
              ],
              "InvalidSKUList": [
                {
                  "SellerSKU": "SKU-123",
                  "ErrorReason": "DoesNotExist"
                }
              ],
              "ASINPrepInstructionsList": [
                {
                  "ASIN": "16074592FB",
                  "BarcodeInstruction": "RequiresFNSKULabel",
                  "PrepGuidance": "ConsultHelpDocuments",
                  "PrepInstructionList": [
                    "Polybagging"
                  ]
                }
              ],
              "InvalidASINList": [
                {
                  "ASIN": "16074592FB",
                  "ErrorReason": "DoesNotExist"
                }
              ]
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
          
    )
})

app.get('/fba/inbound/v0/shipments/:id/transport', (req,res)=>{
    res.send(
        {
            "payload": {
              "TransportContent": {
                "TransportHeader": {
                  "SellerId": "string",
                  "ShipmentId": "123456",
                  "IsPartnered": true,
                  "ShipmentType": "SP"
                },
                "TransportDetails": {
                  "PartneredSmallParcelData": {
                    "PackageList": [
                      {
                        "Dimensions": {
                          "Length": 10,
                          "Width":  10,
                          "Height":  10,
                          "Unit": "inches"
                        },
                        "Weight": {
                          "Value": 0,
                          "Unit": "pounds"
                        },
                        "CarrierName": "simple_name",
                        "TrackingId": "string",
                        "PackageStatus": "SHIPPED"
                      }
                    ],
                    "PartneredEstimate": {
                      "Amount": {
                        "CurrencyCode": "USD",
                        "Value": 0
                      },
                      "ConfirmDeadline": "2021-11-04T14:39:18.469Z",
                      "VoidDeadline": "2021-11-04T14:39:18.469Z"
                    }
                  },
                  "NonPartneredSmallParcelData": {
                    "PackageList": [
                      {
                        "CarrierName": "simple_name",
                        "TrackingId": "string",
                        "PackageStatus": "SHIPPED"
                      }
                    ]
                  },
                  "PartneredLtlData": {
                    "Contact": {
                      "Name": "string",
                      "Phone": "string",
                      "Email": "string",
                      "Fax": "string"
                    },
                    "BoxCount": 0,
                    "SellerFreightClass": "50",
                    "FreightReadyDate": "2021-11-04",
                    "PalletList": [
                      {
                        "Dimensions": {
                          "Length": 10,
                          "Width":  10,
                          "Height":  10,
                          "Unit": "inches"
                        },
                        "Weight": {
                          "Value": 0,
                          "Unit": "pounds"
                        },
                        "IsStacked": true
                      }
                    ],
                    "TotalWeight": {
                      "Value": 0,
                      "Unit": "pounds"
                    },
                    "SellerDeclaredValue": {
                      "CurrencyCode": "USD",
                      "Value": 0
                    },
                    "AmazonCalculatedValue": {
                      "CurrencyCode": "USD",
                      "Value": 0
                    },
                    "PreviewPickupDate": "2021-11-04",
                    "PreviewDeliveryDate": "2021-11-04",
                    "PreviewFreightClass": "50",
                    "AmazonReferenceId": "string",
                    "IsBillOfLadingAvailable": true,
                    "PartneredEstimate": {
                      "Amount": {
                        "CurrencyCode": "USD",
                        "Value": 0
                      },
                      "ConfirmDeadline": "2021-11-04T14:39:18.469Z",
                      "VoidDeadline": "2021-11-04T14:39:18.469Z"
                    },
                    "CarrierName": "string"
                  },
                  "NonPartneredLtlData": {
                    "CarrierName": "simple_name",
                    "ProNumber": "string"
                  }
                },
                "TransportResult": {
                  "TransportStatus": "WORKING",
                  "ErrorCode": "string",
                  "ErrorDescription": "string"
                }
              }
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
          
    )
})


app.put('/fba/inbound/v0/shipments/:id/transport', (req,res)=>{
    res.send(
        {
            "IsPartnered": true,
            "ShipmentType": "SP",
            "TransportDetails": {
              "PartneredSmallParcelData": {
                "PackageList": [
                  {
                    "Dimensions": {
                      "Length": 10,
                      "Width":  10,
                      "Height":  10,
                      "Unit": "inches"
                    },
                    "Weight": {
                      "Value": 0,
                      "Unit": "pounds"
                    }
                  }
                ],
                "CarrierName": "string"
              },
              "NonPartneredSmallParcelData": {
                "CarrierName": "simple_name",
                "PackageList": [
                  {
                    "TrackingId": "string"
                  }
                ]
              },
              "PartneredLtlData": {
                "Contact": {
                  "Name": "some_name",
                  "Phone": "+48000000000",
                  "Email": "some_email@example.com",
                  "Fax": "string"
                },
                "BoxCount": 0,
                "SellerFreightClass": "50",
                "FreightReadyDate": "2021-11-04",
                "PalletList": [
                  {
                    "Dimensions": {
                      "Length": 10,
                      "Width": 10,
                      "Height": 10,
                      "Unit": "inches"
                    },
                    "Weight": {
                      "Value": 0,
                      "Unit": "pounds"
                    },
                    "IsStacked": true
                  }
                ],
                "TotalWeight": {
                  "Value": 8,
                  "Unit": "pounds"
                },
                "SellerDeclaredValue": {
                  "CurrencyCode": "USD",
                  "Value": 0
                }
              },
              "NonPartneredLtlData": {
                "CarrierName": "simple_name",
                "ProNumber": "string"
              }
            }
        }
    )
})

app.post('/fba/inbound/v0/shipments/:id/transport/void', (req,res)=>{
    res.send(
        {
            "payload": {
              "TransportResult": {
                "TransportStatus": "WORKING",
                "ErrorCode": "string",
                "ErrorDescription": "string"
              }
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.post('/fba/inbound/v0/shipments/:id/transport/estimate', (req,res)=>{
    res.send(
        {
            "payload": {
              "TransportResult": {
                "TransportStatus": "WORKING",
                "ErrorCode": "string",
                "ErrorDescription": "string"
              }
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.post('/fba/inbound/v0/shipments/:id/transport/confirm', (req,res)=>{
    res.send(
        {
            "payload": {
              "TransportResult": {
                "TransportStatus": "WORKING",
                "ErrorCode": "string",
                "ErrorDescription": "string"
              }
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipments/:id/labels', (req,res)=>{
    res.send(
        {
            "payload": {
              "DownloadURL": "string"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipments/:id/billOfLoading', (req,res)=>{
    res.send(
        {
            "payload": {
              "DownloadURL": "string"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipments', (req,res)=>{
    res.send(
        {
            "payload": {
              "ShipmentData": [
                {
                  "ShipmentId": "123456",
                  "ShipmentName": "string",
                  "ShipFromAddress": {
                    "Name": "string",
                    "AddressLine1": "705 Boulder Drive",
                    "AddressLine2": "string",
                    "DistrictOrCounty": "string",
                    "City": "Breinigsville",
                    "StateOrProvinceCode": "PA",
                    "CountryCode": "string",
                    "PostalCode": "string"
                  },
                  "DestinationFulfillmentCenterId": "string",
                  "ShipmentStatus": "WORKING",
                  "LabelPrepType": "NO_LABEL",
                  "AreCasesRequired": true,
                  "ConfirmedNeedByDate": "2021-11-04",
                  "BoxContentsSource": "NONE",
                  "EstimatedBoxContentsFee": {
                    "TotalUnits": 0,
                    "FeePerUnit": {
                      "CurrencyCode": "USD",
                      "Value": 0
                    },
                    "TotalFee": {
                      "CurrencyCode": "USD",
                      "Value": 0
                    }
                  }
                }
              ],
              "NextToken": "string"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipments/:id/items', (req,res)=>{
    res.send(
        {
            "payload": {
              "ItemData": [
                {
                  "ShipmentId": "123456",
                  "SellerSKU": "SKU-123",
                  "FulfillmentNetworkSKU": "FNSKU00001",
                  "QuantityShipped": 0,
                  "QuantityReceived": 0,
                  "QuantityInCase": 0,
                  "ReleaseDate": "2021-11-04",
                  "PrepDetailsList": [
                    {
                      "PrepInstruction": "Polybagging",
                      "PrepOwner": "AMAZON"
                    }
                  ]
                }
              ],
              "NextToken": "string"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})

app.get('/fba/inbound/v0/shipmentItms', (req,res)=>{
    res.send(
        {
            "payload": {
              "ItemData": [
                {
                  "ShipmentId": "123456",
                  "SellerSKU": "SKU-123",
                  "FulfillmentNetworkSKU": "FNSKU00001",
                  "QuantityShipped": 0,
                  "QuantityReceived": 0,
                  "QuantityInCase": 0,
                  "ReleaseDate": "2021-11-04",
                  "PrepDetailsList": [
                    {
                      "PrepInstruction": "Polybagging",
                      "PrepOwner": "AMAZON"
                    }
                  ]
                }
              ],
              "NextToken": "string"
            },
            "errors": [
              {
                "code": "string",
                "message": "string",
                "details": "string"
              }
            ]
        }
    )
})
const start = async () => {
    try{
        app.listen(3012, ()=> {
            console.log(`Example app listening at http://localhost:3012`)
        })
    }catch(e){
        console.log(e);
    }
};

start();