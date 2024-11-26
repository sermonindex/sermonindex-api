import AwokenRef, { BibleRef } from 'awoken-bible-reference';

const subject = '1 Corinthian 15:1-4';

function parseBibleReferences(text: string) {
  let refs: BibleRef[] = [];

  try {
    refs = AwokenRef.parseOrThrow(text.trim());
  } catch (error) {
    try {
      const split = text.split('-');
      refs = AwokenRef.parseOrThrow(split[0].trim());
    } catch (error) {
      try {
        const s = text.replace(/,/g, ';');
        refs = AwokenRef.parseOrThrow(s);
      } catch (error) {
        try {
          refs = [AwokenRef.repair(error)];
        } catch (error) {
          console.log('Error parsing reference: ', text);
          console.log(error);
          return;
        }
      }
    }
  }

  let all;
  try {
    all = AwokenRef.format(refs, {
      combine_ranges: true,
    });

    let references: string[] = [];
    all.split(';').map((ref) => {
      const verses = ref.split(':')[1].split(',');
      const r = AwokenRef.parseOrThrow(ref.trim());
      if (r[0].is_range || verses.length < 3) {
        references.push(`${ref}`);
      } else {
        references.push(
          `${r[0]?.book} ${r[0].chapter}:${verses[0]}-${verses[verses.length - 1]}`,
        );
      }
    });

    return AwokenRef.parseOrThrow(references.join(';'));
  } catch (error) {
    console.log('Error formatting reference: ', text);
    console.log(all);
    console.log(error);
    return;
  }
}

parseBibleReferences(subject);
