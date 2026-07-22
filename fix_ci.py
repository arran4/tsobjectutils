with open('.github/workflows/ci.yml') as f:
    lines = f.readlines()

# Fix route job so run_release is set to true on push to main
new_lines = []
for line in lines:
    new_lines.append(line)
    if line.strip() == "run_code_checks=true" and new_lines[-2].strip() == "push)":
        new_lines.append('              if [[ "${{ github.ref }}" == refs/heads/main || "${{ github.ref }}" == refs/heads/master ]]; then\n')
        new_lines.append('                # In versioning.yaml we auto bump if main was updated. We let run_release trigger version-and-release\n')
        new_lines.append('                run_release=true\n')
        new_lines.append('              fi\n')

lines = new_lines

with open('.github/workflows/ci.yml', 'w') as f:
    f.writelines(lines)
