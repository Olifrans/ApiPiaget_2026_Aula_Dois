using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ApiPiagetDois.Models;

namespace ApiPiagetDois.Data
{
    public class ApiPiagetDoisContext : DbContext
    {
        public ApiPiagetDoisContext (DbContextOptions<ApiPiagetDoisContext> options)
            : base(options)
        {
        }

        public DbSet<ApiPiagetDois.Models.Aluno> Aluno { get; set; } = default!;
        public DbSet<ApiPiagetDois.Models.Professor> Professor { get; set; } = default!;
    }
}
