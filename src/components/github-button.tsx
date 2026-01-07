import {IconBrandGithub} from "@tabler/icons-react";
import {Button} from "./ui/button";

export default function GitHubButton() {
    return <Button size={"icon"} variant="outline" render={<a href="https://github.com/flx-fx/ReaCue"
                                                              target="_blank"
                                                              rel="noopener noreferrer"><IconBrandGithub/></a>}></Button>
}