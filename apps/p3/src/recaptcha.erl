-module(recaptcha).
-define(RECAPTHA_API_URL, <<"https://www.google.com/recaptcha/api/siteverify">>).
-define(TESTKEY, <<"6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe">>).
-export([verify/2]).

-spec verify_live(binary(), binary(), binary()) -> atom().
verify_live(RemoteIP, Captcha, Key) ->
    URL = <<?RECAPTHA_API_URL/binary,
    <<"?secret=">>/binary, Key/binary,
    <<"&remoteip=">>/binary, RemoteIP/binary,
    <<"&response=">>/binary, Captcha/binary >>,
    {ok, 200, _Headers, ClientRef} =
        hackney:request(get, URL, [], <<>>, []),
    {ok, Body} = hackney:body(ClientRef),
    {Google} = jiffy:decode(Body),
    case proplists:get_value(<<"success">>, Google) of
    true ->
        ok;
    _ ->
        throw(invalid_captcha)
    end.

-spec verify(binary(), binary()) -> atom().
verify(RemoteIP, Captcha) ->
    % Safety checks on captcha string
    % TODO: Formally confirm max length of captcha. Largest seen in wild is 292.
    case cow_uri:urlencode(Captcha) =:= Captcha andalso
        byte_size(Captcha) < 512 of
    true ->
        ok;
    false ->
        throw(invalid_captcha)
    end,
    case application:get_env(p3, captcha_key) of
    undefined ->
        % Recaptcha key not setup - probably testing or dev
        verify_live(RemoteIP, Captcha, ?TESTKEY);
    {ok, Key} ->
        verify_live(RemoteIP, Captcha, Key)
    end.

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").


verify_captcha_test() ->
    application:ensure_all_started(hackney),
    ?assertEqual(ok, verify(<<"127.0.0.1">>, <<"ANYTHING">>)).
-endif.
