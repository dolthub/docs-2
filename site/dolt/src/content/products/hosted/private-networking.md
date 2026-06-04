---
title: "Private Networking"
description: Connecting Hosted Dolt over private networking / VPC peering instead of the public internet.
---


When you create a Hosted Dolt deployment, you get a server setup and configured to accept connections from anywhere.
These connections obviously still require authentication, and your standard grants and roles will dictate the things
that a user can do. However, this isn't the behavior that most mature companies with established and secure cloud
deployments want. In that case, we offer private database deployments for both AWS and GCP. These deployments use
cloud-specific technologies to provide access to your database, while taking it off of the public internet.

## Creating an AWS Deployment That Uses Private Networking

Creating a Private Deployment on Hosted Dolt looks almost exactly like creating a normal one. From the [create deployment page](https://hosted.doltdb.com/create-deployment),
give your new deployment a name and be certain to choose a cluster type of "Dolt."

![create deployment page 1](../../../content/.gitbook/assets/create_privatelink_page_1.png)

On the next page, leave the cloud provider as AWS and choose a zone which is in the same region as your AWS VPC. Your 
private deployment will be accessible from any zones within the region, but the VPC Endpoints which you will create to 
connect to your Private Deployment must be in subnets within subnets that are in the same region as your Private Deployment. 
After choosing your instance type, storage type and volume size, click Next.

![create deployment page 2](../../../content/.gitbook/assets/create_privatelink_page_2.png)

On the next page, there is a check box for "Private deployment". If you select it, you will be prompted for a list of AWS 
account IDs which will be authorized to connect to the service. Go ahead and enter at least one AWS account ID which you 
would like to be authorized. You can change this list of Account IDs in the future, if you need to add new accounts, for 
example.

![create deployment page 3](../../../content/.gitbook/assets/create_privatelink_page_3.png)

Click next to review your options and click "Create deployment" if everything looks right.

![create deployment page 4](../../../content/.gitbook/assets/create_privatelink_page_4.png)

Private Deployments can also be created for a Trial instance. After choosing the deployment name and clicking "Next", you 
will be taken directly to the "Confirmation" page. Simply click "Edit" next to the "Advanced" section to go to the page 
where you can choose the "Private deployment" option and enter the authorized account IDs.

After creating your deployment, it will enter a Starting phase. Private Deployments take quite a bit longer to launch than 
regular deployments, because some of the VPC network infrastructure which is provisioned as a part of their creation takes 
a bit of time to create and become available. You can expect the launch to take up to 20 minutes. After the network 
infrastructure is created, the instances themselves will be launched. At this point, your private deployment is fully 
available and you can access it through the SQL workbench and interact with it through the Hosted Dolt website. To access 
it from your VPC, you will need to a bit of work.

## Configuring Your AWS Project

To access your Private Deployment from your VPC, you need to create 
[VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html#concepts-vpc-endpoints) for accessing it. 
Each Private Deployment creates two VPC Endpoint Services whose names are listed on the deployment details page. The primary 
endpoint service will always have the current primary of the cluster behind it. This is the only endpoint that should receive 
write traffic from your application. The cluster endpoint service will always have every deployed instance in the cluster 
behind it. It should receive read-only traffic if you're attempting to scale reads for your application. Because deployments 
in Hosted Dolt can always add replicas, we create the cluster endpoint services even for deployments that currently have 
zero replicas.

![private link details](../../../content/.gitbook/assets/privatelink_details.png)

The first thing you will need to do to connect to your Private Deployment from your VPC is to make certain that the account 
IDs you gave when you created the deployment include the AWS account ID in which the VPC is located. If the AWS account 
ID is not currently included, feel free to add it on the database page and click "Update" for your changes to take effect.

Then, make certain you have the necessary prerequisites for creating the VPC Endpoint. You need the following:

1. Your VPC should have "DNS hostnames" and "DNS resolution" both Enabled. If this is not already the case, you can change 
2. these settings under "Edit VPC Settings" in the AWS console, or you can use AWS CLI with something like 
3. `aws ec2 modify-vpc-attribute --vpc-id [VPC_ID] --enable-dns-support && aws ec2 modify-vpc-attribute --vpc-id [VPC_ID] --enable-dns-hostnames`.

2. Your VPC should have an appropriate security group which you can use for the VPC Endpoints you create. This security 
3. roup should allow ingress on port 3306, the MySQL port, from any instances which are supposed to access it. If you want 
4. to use your Hosted SQL instance as a Dolt remote for clone and pull, it should also allow ingress on port 443. You can 
5. attach multiple security groups to the VPC Endpoints if you need to.

3. Your VPC should have at least one subnet in which the VPC Endpoint will create network interfaces. You can give one 
4. subnet per zone to the VPC Endpoint. Giving your VPC Endpoint endpoint multiple zones within the region can make access 
5. to your endpoint more resilient and cheaper.

If you have all of the above, the only thing left to do is to create the VPC Endpoint. In the section for "Private Link 
Information" on your Deployment's Database page, you copy the Service Name for which you want to create the Endpoint. 
Then you create the endpoint through whatever mechanism you want: AWS CLI, AWS Console, Terraform, etc. Using AWS CLI, 
creating the endpoint looks like:

```bash
aws ec2 create-vpc-endpoint \
  --vpc-endpoint-type Interface \
  --vpc-id [VPC_ID] \
  --service-name [SERVICE_NAME] \
  --security-group-ids [SECURITY_GROUP_ID_1] [SECURITY_GROUP_ID_2] ... \
  --subnet-ids [SUBNET_ID_1] [SUBNET_ID_2] ...
```

The endpoint will start a Pending state. It should quickly transition to Available. From that point forward, the DNS names 
associated with the endpoint should be resolved within the VPC, and you will be able to connect to the database through them. 
The DNS name which Hosted Dolt manages is listed on the deployment database details page, as "Primary Host" and "Cluster Host" 
for the two different endpoint services. You can take the connect strings or the MySQL client invocations and use those as well 
from any host that has access to the newly created VPC Endpoint and the VPC's DNS resolution services, for example, from an 
EC2 instance which is within the VPC.

If you destroy a Private Deployment, then any VPC Endpoints currently attached to its endpoint services will transition to 
a "Rejected" status. You should delete these from your AWS account, since they are no longer functional or necessary.

## Creating a GCP Deployment That Uses Private Networking

To begin we will need to collect either our existing GCP project IDs, or both the project IDs and the VPC network names
that we want to be able to connect to our [Dolt](https://doltdb.com) database. Once we have that we will go to
[https://hosted.doltdb.com](https://hosted.doltdb.com) and create a new deployment. We need to create a standard deployment
as trial deployments are not supported on GCP.

![Create Deployment](../../../content/.gitbook/assets/psc-create-dep-about.png)

After naming our standard Dolt deployment, we will need to select GCP on the next page and fill in where you want your deployment
to be created, as well as what instance type you would like and how much storage you need. When selecting the zone to deploy to,
it is recommended that you place the instance in the same zone as the VPC you will be connecting from.

![Create Deployment](../../../content/.gitbook/assets/psc-create-dep-instance.png)

Finally, on the Advanced page you will need to select "Private Deployment" and then fill in either the GCP "Allowed Project IDs" or
the "Allowed VPCs" with the data you collected earlier.

![Create Deployment](../../../content/.gitbook/assets/psc-create-dep-advanced-private.png)

## Configuring your GCP Project

Now that you have created the deployment, we will need to wait a few minutes for the cloud infrastructure to be created.
Once our deployment is running, we need to go to the deployment page under the connectivity section and get the "Target Service"
and the "Endpoint Name."

![Get Target Service and Endpoint Name](../../../content/.gitbook/assets/psc-dep-psc-details.png)

With these pieces of information, you need to go to the GCP console and select your project. With your project selected
click the search icon and type "Private Service Connect."

![GCP Cloud Console](../../../content/.gitbook/assets/psc-gcp-console-start.png)
![Select Private Service Connect](../../../content/.gitbook/assets/psc-gcp-console-select-psc.png)

Once you are on the Private Service Connect page, click "Connect Endpoint."

![Private Service Connect Page](../../../content/.gitbook/assets/psc-gcp-console-psc-page.png)

Next Select "Published service" and then fill in the "Target Service" and "Endpoint Name" fields with the values from the
[Hosted Dolt](https://hosted.doltdb.com) deployment page of your private deployment. Once you have filled in these fields
you will need to select the Network and Subnetwork you want to connect from. Then you will need to create a private internal
IP address for the connection.
![Create IP](../../../content/.gitbook/assets/psc-gcp-console-create-ip.png)
![Create IP Dialog](../../../content/.gitbook/assets/psc-gcp-console-create-ip-dialog.png)

After creating the IP address, you will create a namespace for the connection. This namespace will allow the appropriate
DNS entries to be set up within your projects.

![Create Namespace](../../../content/.gitbook/assets/psc-gcp-console-create-namespace.png)
![Create Namespace Dialog](../../../content/.gitbook/assets/psc-gcp-console-create-namespace-dialog.png)

With the form filled in you can click "Add Endpoint" to create the connection.

![Create PSC Form Filled](../../../content/.gitbook/assets/psc-gcp-console-create-psc-form-filled.png)

After a few minutes the connection will be created and you can see the connection in the list of endpoints.

![PSC Show Created and Connected](../../../content/.gitbook/assets/psc-gcp-console-psc-show-connected.png)


