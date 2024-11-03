FROM postgres:16
COPY sermonindex.dump /sermonindex.dump 
CMD pg_restore -h pgsql --no-owner --no-privileges --no-password --clean -d sermonindex_local -U root /sermonindex.dump

