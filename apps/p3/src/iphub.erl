-module(iphub).
-define(IPHUB_API_URL, <<"http://v2.api.iphub.info/ip/">>).
-export([verify/1]).

-spec verify_live(binary(), binary()) -> atom().
verify_live(RemoteIP, Key) ->
    URL = <<?IPHUB_API_URL/binary, RemoteIP/binary >>,
    Header = [ {<<"X-Key">>, Key} ],
    % In a pattern very unusual for a security test, we deliberately "accept"
    % in the case of any exception. Reason being, this is a third party
    % service which can fail in an number of ways, including connectivity,
    % or excveeding IPHub rate limits.
    % As this is a minor mitigation, this is not considered a security issue.
    try
    {ok, 200, _Headers, ClientRef} =
        hackney:request(get, URL, Header, <<>>, []),
    {ok, Body} = hackney:body(ClientRef),
    {IPHubResponse} = jiffy:decode(Body),
    proplists:get_value(<<"block">>, IPHubResponse)
    of
    1 ->
        throw(banned_ip);
    Block ->
        % Block or 1 or 3 are considered "acceptable" traffic
        ok
    catch
    _Error:_Message ->
        ok
    end.

-spec verify(binary()) -> atom().
verify(RemoteIP) ->
    case application:get_env(p3, iphub_key) of
    undefined ->
        % Key not setup - probably testing or dev
        ok;
    {ok, Key} ->
        verify_live(RemoteIP, Key)
    end.

