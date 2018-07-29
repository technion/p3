-module(validate).
-export([valid_name/1]).

% Valid list: https://support.office.com/en-us/article/prepare-to-provision-users-through-directory-synchronization-to-office-365-01920974-9e6f-4331-a370-13aea4e82b3e

-spec(valid_name(string()) -> ok).
valid_name(Name) ->
    case length(Name) < 64  andalso
    length(string:split(Name, "@", all)) =:= 2 of
    true ->
        valid_name_chars(Name);
    false ->
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

