-module(validate).
-export([valid_name/1]).

valid_domain(Domain) ->
    Whitelist = [ "ad.lolware.net", "ds.lolware.net" ],
    case lists:member(Domain, Whitelist) of
    true ->
        ok;
    _ ->
        throw(username_not_valid)
    end.

% Valid list: https://support.office.com/en-us/article/prepare-to-provision-users-through-directory-synchronization-to-office-365-01920974-9e6f-4331-a370-13aea4e82b3e

-spec(valid_name(string()) -> ok).
valid_name(Name) ->
    case length(Name) < 64  andalso
    string:split(Name, "@", all) of
    [User, Domain] ->
        valid_domain(Domain),
        valid_name_chars(User),
        ok;
    _ ->
        throw(username_not_valid)
    end.

valid_name_chars([]) ->
    ok;
valid_name_chars([A|_Rest]) when A < 33 -> % Includes space and unprintable chars
    throw(username_invalid_char);
valid_name_chars([$"|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$/|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$\\|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$[|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$]|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$:|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$;|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$||_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$=|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$,|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$+|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$*|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$?|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$>|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([$<|_Rest]) ->
    throw(username_invalid_char);
valid_name_chars([_H|Rest]) ->
    valid_name_chars(Rest).

-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").

good_test() ->
    ?assertEqual(ok, valid_name("validname@ad.lolware.net")).

bad_domain_test() ->
    ?assertThrow(username_not_valid,  valid_name("validnamenodomain")),
    ?assertThrow(username_not_valid,  valid_name("validname@baddomain.com")).

bad_char_test() ->
    ?assertThrow(username_not_valid,  valid_name("in@validname@ad.lolware.net")),
    ?assertThrow(username_invalid_char,  valid_name("in<valid@ad.lolware.net")).

-endif.

