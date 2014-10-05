#!/usr/bin/env perl

use strict;
use warnings;
use LWP::Simple;
use Digest::MD5 qw(md5_hex);
use XML::XML2JSON;
use URI;
use CGI;

my $cgi  = CGI->new;
my $page = $cgi->param('page') || 1;
if ($page !~ /^[0-9]+$/) {
  $page = 1;
}

my $api_key = 'API_KEY';
my $auth_token = 'AUTH_TOKEN';
my $user_id = 'USER_ID';
my $method = 'flickr.photos.search';
my $content_type = '1';
my $tags = 'COMMA,SEPARATED,TAGS';
my $per_page = '60';
my $extras = 'date_taken,url_s,url_z';
my $sort = 'date-taken-desc';

my $params = {
  api_key => $api_key,
  auth_token => $auth_token,
  method => $method,
  user_id => $user_id,
  content_type => $content_type,
  tags => $tags,
  per_page => $per_page,
  extras => $extras,
  page => $page,
  sort => $sort,
};

sub create_api_sig {
  my $args = shift;
  my $sig  = 'SIGNATURE';
  foreach my $key (sort {$a cmp $b} keys %{$args}) {
    my $value = (defined($args->{$key})) ? $args->{$key} : "";
    $sig .= $key . $value;
  }
  return md5_hex($sig);
}

my $api_sig = create_api_sig($params);

my $url = URI->new('http://flickr.com/services/rest/');
$url->query_form(%{$params}, (api_sig => $api_sig));
my $XML2JSON = XML::XML2JSON->new();
print "Content-type: application/json;charset=utf-8\n\n";
print $XML2JSON->convert(get($url));

