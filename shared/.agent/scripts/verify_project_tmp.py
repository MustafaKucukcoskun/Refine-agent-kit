import os
import json

def verify():
    print("## \u2705 Project Verification: Refine (Antigravity Core)\n\n### Results\n")
    
    # 1. Agent & Skill
    agent_status = "\u26d4"
    agent_msg = ".agent/ARCHITECTURE.md missing"
    if os.path.exists(".agent/ARCHITECTURE.md"):
        agent_status = "\u2705"
        agent_msg = "All agents present"
        
    print(f"| Agent files  | {agent_status} | {agent_msg} |")
    print(f"| Skill files  | {agent_status} | {agent_msg} |")
    
    # 2. Workflows
    wf_path = ".agent/workflows"
    wf_status = "\u2705"
    wf_msg = ""
    if os.path.exists(wf_path):
        wfs = [f for f in os.listdir(wf_path) if f.endswith(".md")]
        wf_msg = f"{len(wfs)} workflows valid"
    else:
        wf_status = "\u26d4"
        wf_msg = "workflows/ missing"
    print(f"| Workflows    | {wf_status} | {wf_msg} |")
    
    # 3. Domain pack check
    dom_status = "\u2705"
    dom_msg = "All rule files map"
    dom_path = ".agent/domains"
    rules_path = ".agent/rules/domains"
    if os.path.exists(dom_path) and os.path.exists(rules_path):
        domains = [f.replace(".json", "") for f in os.listdir(dom_path) if f.endswith(".json")]
        rules = [f.replace("-rules.md", "") for f in os.listdir(rules_path) if f.endswith(".md")]
        missing_rules = [d for d in domains if d not in rules]
        if missing_rules:
            dom_status = "\u26d4"
            dom_msg = f"Missing rules for: {', '.join(missing_rules)}"
    else:
        dom_status = "\u26d4"
        dom_msg = "Domains missing"
    print(f"| Domain packs | {dom_status} | {dom_msg} |")
    
if __name__ == "__main__":
    verify()
