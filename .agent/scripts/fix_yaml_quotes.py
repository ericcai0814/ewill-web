import sys
import re

def fix_yaml_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        new_lines = []
        changed = False
        # Regex to find lines like: key: 'string with 'another' quote'
        # It captures the key and the single-quoted value
        pattern = re.compile(r"^(\s*\w+:\s*)'(.*'.*)'$")

        for line in lines:
            match = pattern.match(line.strip())
            if match:
                key_part = match.group(1)
                value_part = match.group(2)
                # Replace outer quotes with double quotes
                new_line = f'{key_part}"{value_part}"\n'
                new_lines.append(new_line)
                changed = True
                print(f"FIXED: {file_path}\n  - {line.strip()}\n  + {new_line.strip()}")
            else:
                new_lines.append(line)

        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            return True
        return False

    except Exception as e:
        print(f"Error processing file {file_path}: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_yaml_quotes.py <file1.yml> <file2.yml> ...", file=sys.stderr)
        sys.exit(1)

    files_to_fix = sys.argv[1:]
    fixed_count = 0
    for file_path in files_to_fix:
        if fix_yaml_file(file_path):
            fixed_count += 1
    
    print(f"\nProcessed {len(files_to_fix)} files. Fixed {fixed_count} files.")
