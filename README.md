# Using the software

Online: go to https://guichaoua.gitlab.io/web-hexachord/ 

Locally, limited support: clone the repository and open the index.html page. Some functionalities (such as loading the example MIDI) may not work this way.

Locally, full support: clone, then run a basic http server on your machine from the cloned directory, e.g., a python (≥3) server: `python -m http.server`  (access the page through `localhost:8000` with default settings).

Truly locally: the latter 2 methods still require Internet access to load the required libraries. Running the `cacheLibraries.sh` script while connected to the Internet should ensure that the server method still works once offline.

# Credit

Conceived and developped by Corentin Guichaoua and Moreno Andreatta

# Acknowledgments

Thanks to Louis Bigo for the original Hexachord software.

Thanks to Philipp Legner for improving on the initial visual design and his feedback.

Thanks to people who helped translate the software to other languages:
    German: Philipp Legner
    Hindi: Nilesh Trivedi

Sample MIDI tracks are interpretted by Moreno Andreatta.

Thanks to all collaborators for inspiration.

Thanks to USIAS / University of Strasbourg / IRMA / IRCAM for financial support.

# Citation
www.gitlab.com/guichaoua/web-hexachord
Academic paper to come, please check back later
