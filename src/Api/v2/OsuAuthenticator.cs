using System;
using System.Text.Json;
using System.Threading.Tasks;
using PanchoBot.Api.v2.Models;
using RestSharp;
using RestSharp.Authenticators;

namespace PanchoBot.Api.v2;

public class OsuAuthenticator : AuthenticatorBase {
    private readonly string _baseUrl;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private long _tokenExpirationTicks;

    public OsuAuthenticator(string baseUrl, string clientId, string clientSecret) : base("") {
        _baseUrl = baseUrl;
        _clientId = clientId;
        _clientSecret = clientSecret;
    }

    protected override async ValueTask<Parameter> GetAuthenticationParameter(string accessToken) {
        if (string.IsNullOrEmpty(Token) || _tokenExpirationTicks < DateTime.Now.Ticks)
            Token = await GetToken();

        return new HeaderParameter(KnownHeaders.Authorization, Token);
    }

    private async Task<string> GetToken() {
        using var client = new RestClient(_baseUrl) {
            Authenticator = new HttpBasicAuthenticator(_clientId, _clientSecret)
        };

        var request = new RestRequest()
            .AddParameter("client_id", _clientId)
            .AddParameter("client_secret", _clientSecret)
            .AddParameter("grant_type", "client_credentials")
            .AddParameter("scope", "public");

        var response = await client.PostAsync(request);

        if (!response.IsSuccessful) return string.Empty;

        var responseData = JsonSerializer.Deserialize<TokenResponse>(response.Content!);
        _tokenExpirationTicks = DateTime.Now.AddSeconds(responseData!.ExpiresIn - 3600).Ticks;
        return $"{responseData.TokenType} {responseData.AccessToken}";
    }
}
