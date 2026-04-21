---
title: "Hosted Dolt: Single Sign-On"
---

# SSO

## What is SAML?

[SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language) (Security
Assertion Markup Language) is a standard for exchanging authentication and authorization
data between a Service Provider (SP) - in this case [Hosted
Dolt](https://hosted.doltdb.com) - and an Identity Provider (IdP) - some third-party
provider. A Hosted customer would configure an identity provider for their organization
within the Hosted product, and their users would authenticate and authorize access to that
organization through their configured identity provider.

SAML is a popular enterprise solution due to the improved user experience and increased
security it provides. Users only need to manage one set of credentials for multiple
applications. The service provider no longer needs to store any login credentials for your
users and you can rely instead on more specialized identity providers to provide more
layers of security.

This is what a SAML SSO workflow looks like on Hosted Dolt:

![](../../.gitbook/assets/hosted-sso-saml-diagram.png)

## How to set up SSO for your Hosted organization

Setting up SSO for your Hosted organization only takes a few minutes. This example will
use [Okta](https://www.okta.com/) as our third-party identity provider.

### 1. Create an organization on Hosted

Assuming you already have a Hosted account, you first need to [create an
organization](https://hosted.doltdb.com/organizations). In order to set up SSO, it is
required that your organization has at least one bootstrap admin user at all times that
was not created through the SAML workflow.

![](../../.gitbook/assets/hosted-create-org.png)

### 2. Set up your third-party IdP

You can follow Okta's [guide to building a SSO
integration](https://developer.okta.com/docs/guides/build-sso-integration/saml2/main/) for more specific setup information, but we will give an overview here.

First, you must create an [Okta Developer Edition
Organization](https://developer.okta.com/signup/). Then, navigate to Applications >
Applications and create a new app integration.

![](../../.gitbook/assets/okta-new-app-integration.png)

Give your app a name and (optional) logo.

![](../../.gitbook/assets/okta-create-saml-integration-general.png)

Fill out the SAML settings. You can find this information in the SSO tab of your
organization on Hosted.

![](../../.gitbook/assets/okta-create-saml-integration-configure.png)

If you'd like to add a signature certificate to verify the digital signatures, you can
download the certificate from your Hosted organization's SSO page and upload it in
Advanced Settings.

![](../../.gitbook/assets/okta-create-saml-integration-advanced-settings.png)

Once your SAML integration is created it should look something like this:

![](../../.gitbook/assets/okta-saml-integration.png)

Download the metadata details from the provided Metadata URL. You'll need this when you
add this identity provider to your Hosted organization.

```shell
curl -OL https://dev-99612740.okta.com/app/exkb7ksuh3Jn9h90I5d7/sso/saml/metadata
```

Then in the Assignments tab, choose some People or Groups to assign to your integration.
These people or groups will have single sign on into your Hosted organization.

![](../../.gitbook/assets/okta-saml-assign-people.png)

### 3. Set up Hosted with the metadata from your IdP

Now back to the Hosted website. In the SSO tab of your organization, add the metadata
descriptor you downloaded from your Okta integration and click `Configure`.

![](../../.gitbook/assets/hosted-configure-saml-sso.png)

You can now share your organization's SSO login url (in this case
https://hosted.doltdb.com/organizations/mycompany/sso) with the people you added to your
Okta integration. They'll also have this link when they log in to their Okta account.

![](../../.gitbook/assets/okta-my-apps.png)

### 4. Signing in to your organization's login URL

When people from your Okta integration navigate to your organization's Login URL, they'll
be redirected to the Okta SSO URL and prompted to log in (if they aren't already).

![](../../.gitbook/assets/okta-sso-url.png)

After successfully entering their Okta credentials, the Hosted website will check if a
user exists that matches the Name ID from the SAML response from Okta. If a Hosted user
does not already exist, they will be prompted for an email and username.

![](../../.gitbook/assets/hosted-create-saml-account.png)

The user will receive an email to verify their email address and automatically be added as
a member to your organization. In the future when they log in they will be immediately
directed to your organization page.

## Differences between SAML-created users and other users

Since users created via an organization's SSO workflow only exist within the context of an
organization, they have a few different permissions and properties.

These organization-specific users cannot:

- Create an organization
- Be added as a member to another organization
- Be added as a collaborator to a deployment outside of their organization
- Create a deployment that does not belong to their organization
- Add billing (for their own user or any organization)
- Be the only owner of an organization

This also means that these users will be deleted under certain circumstances:

- The organization they belong to is deleted
- They are removed as a member from the organization
- The SSO configuration is removed from the organization
